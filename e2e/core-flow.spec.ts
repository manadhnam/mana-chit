import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

// --- Test Data ---
const testData = {
  branch: {
    name: `Test Branch ${faker.company.buzzNoun()}-${faker.number.int(1000)}`,
    code: faker.string.alphanumeric(5).toUpperCase(),
    address: faker.location.streetAddress(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
  },
  agent: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }) + 'a1!',
    mobile: faker.phone.number(),
    position: 'Field Agent',
    salary: 50000,
  },
  customer: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    mobile: faker.phone.number(),
    address: faker.location.streetAddress(),
  }
};

test.describe.serial('Core Application Flow', () => {

  test('Super Admin creates Branch and Agent, then Agent creates a Customer', async ({ page }) => {
    // --- Part 1: Super Admin Logs In and Creates a Branch ---
    await test.step('Login as Super Admin and Create Branch', async () => {
      await page.goto('/');
      
      await expect(page.getByText('Select Your Role')).toBeVisible({timeout: 15000});

      await page.getByTestId('role-selector').selectOption('superAdmin');
      await page.getByLabel('Email Address').fill(process.env.SUPER_ADMIN_EMAIL!);
      await page.getByLabel('Password').fill(process.env.SUPER_ADMIN_PASSWORD!);
      await page.getByRole('button', { name: 'Login' }).click();

      await expect(page.getByRole('heading', { name: 'Super Admin Dashboard' })).toBeVisible({timeout: 10000});

      await page.getByRole('link', { name: 'Branch Management' }).click();
      await page.getByRole('button', { name: 'Create Branch' }).click();
      
      await page.getByLabel('Branch Name').fill(testData.branch.name);
      await page.getByLabel('Branch Code').fill(testData.branch.code);
      await page.getByLabel('Address').fill(testData.branch.address);
      await page.getByLabel('Phone').fill(testData.branch.phone);
      await page.getByLabel('Email').fill(testData.branch.email);
      
      await page.getByRole('button', { name: 'Save Branch' }).click();
      await expect(page.getByText('Branch created successfully!')).toBeVisible();
      await expect(page.getByRole('cell', { name: testData.branch.name })).toBeVisible();
    });

    // --- Part 2: Super Admin Creates an Agent in the New Branch ---
    await test.step('Create Agent', async () => {
      await page.getByRole('link', { name: 'Staff Directory' }).click();
      await page.getByRole('button', { name: 'Add New Staff' }).click();

      await page.getByLabel('Full Name').fill(testData.agent.name);
      await page.getByLabel('Email').nth(0).fill(testData.agent.email);
      await page.getByLabel('Password').fill(testData.agent.password);
      await page.getByLabel('Phone').fill(testData.agent.mobile);
      
      await page.getByLabel('Role').locator('..').getByRole('combobox').click();
      await page.getByLabel('Agent').click();

      await page.getByLabel('Branch').locator('..').getByRole('combobox').click();
      await page.getByText(testData.branch.name).click();

      await page.getByLabel('Position / Title').fill(testData.agent.position);
      
      await page.getByLabel('Department').locator('..').getByRole('combobox').click();
      // This assumes a 'Field Operations' department exists. Adjust if necessary.
      await page.getByText('Field Operations').click();

      await page.getByLabel('Salary').fill(testData.agent.salary.toString());
      await page.getByLabel('Joining Date').fill('2024-01-01');

      await page.getByRole('button', { name: 'Save Staff Member' }).click();
      await expect(page.getByText(`Staff member ${testData.agent.name} created successfully.`)).toBeVisible();
    });

    // --- Part 3: Logout and Login as the New Agent ---
    await test.step('Login as New Agent', async () => {
      // Find a user menu button - might need a data-testid
      await page.locator('button').filter({ hasText: testData.agent.name[0] }).click();
      await page.getByRole('menuitem', { name: 'Logout' }).click();
      await expect(page.getByRole('heading', { name: 'Select Your Role' })).toBeVisible();
      
      await page.getByTestId('role-selector').selectOption('agent');
      await page.getByLabel('Email Address').fill(testData.agent.email);
      await page.getByLabel('Password').fill(testData.agent.password);
      await page.getByRole('button', { name: 'Login' }).click();
      
      await expect(page.getByRole('heading', { name: `Welcome, ${testData.agent.name}!` })).toBeVisible({timeout: 10000});
    });

    // --- Part 4: Agent Creates a New Customer ---
    await test.step('Agent Creates Customer', async () => {
      await page.getByRole('link', { name: 'Add Customer' }).click();
      await expect(page.getByRole('heading', { name: 'Add New Customer' })).toBeVisible();

      await page.getByLabel('Full Name').fill(testData.customer.name);
      await page.getByLabel('Email Address').fill(testData.customer.email);
      await page.getByLabel('Phone Number').fill(testData.customer.mobile);
      await page.getByLabel('Address').fill(testData.customer.address);

      await page.getByRole('button', { name: 'Submit for Approval' }).click();
      await expect(page.getByText('Customer created successfully and is pending approval.')).toBeVisible();
    });
  });
}); 