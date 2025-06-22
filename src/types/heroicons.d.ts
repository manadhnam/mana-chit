declare module '@heroicons/react/outline' {
  import { FC, SVGProps } from 'react';
  
  export interface IconProps extends SVGProps<SVGSVGElement> {
    title?: string;
    titleId?: string;
  }
  
  export const ChartBarIcon: FC<IconProps>;
  export const UserGroupIcon: FC<IconProps>;
  export const CurrencyDollarIcon: FC<IconProps>;
  export const ClockIcon: FC<IconProps>;
  export const CheckCircleIcon: FC<IconProps>;
  export const XCircleIcon: FC<IconProps>;
  export const ExclamationCircleIcon: FC<IconProps>;
  export const TrendingUpIcon: FC<IconProps>;
  export const TrendingDownIcon: FC<IconProps>;
} 