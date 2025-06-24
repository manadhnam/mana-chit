import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
// import { Switch } from '../ui/switch';
import { Post } from '../../pages/super-admin/BlogManagement';

interface PostEditorProps {
  post: Post | null;
  onSave: (post: Post) => void;
  onCancel: () => void;
}

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const PostEditor = ({ post, onSave, onCancel }: PostEditorProps) => {
  const [formData, setFormData] = useState<Post>({
    title: '',
    content: '',
    slug: '',
    published: false,
    image_url: '',
  });

  useEffect(() => {
    if (post) {
      setFormData(post);
    } else {
      setFormData({
        title: '',
        content: '',
        slug: '',
        published: false,
        image_url: '',
      });
    }
  }, [post]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    setFormData({ ...formData, title, slug });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={handleTitleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={10}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (Optional)</Label>
        <Input
          id="imageUrl"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        {/* <Switch 
          id="published" 
          checked={formData.published}
          onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
        /> */}
        <Label htmlFor="published">Publish</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Post</Button>
      </div>
    </form>
  );
}; 