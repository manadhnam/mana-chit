import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { PostEditor } from '../../components/admin/PostEditor';
import { toast } from 'react-hot-toast';
import { PostgrestError } from '@supabase/supabase-js';

export interface Post {
  id?: string;
  title: string;
  content: string;
  slug: string;
  image_url?: string;
  published: boolean;
  created_at?: string;
}

export const BlogManagement = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (error) {
      toast.error('Failed to fetch posts');
      console.error(error);
    } else {
      setPosts(data as Post[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSave = async (post: Post) => {
    let error: PostgrestError | null = null;

    if (post.id) {
      // Update
      ({ error } = await supabase.from('posts').update(post).eq('id', post.id));
    } else {
      // Create
      ({ error } = await supabase.from('posts').insert(post));
    }

    if (error) {
      toast.error(`Failed to save post: ${error.message}`);
    } else {
      toast.success(`Post ${post.id ? 'updated' : 'created'} successfully`);
      setIsDialogOpen(false);
      fetchPosts();
    }
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) {
        toast.error('Failed to delete post');
      } else {
        toast.success('Post deleted successfully');
        fetchPosts();
      }
    }
  };
  
  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedPost(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Blog Management</CardTitle>
          <Button onClick={handleAddNew}>Add New Post</Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading posts...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.published ? 'Published' : 'Draft'}</TableCell>
                    <TableCell>{new Date(post.created_at || '').toLocaleDateString()}</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id!)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
          </DialogHeader>
          <PostEditor 
            post={selectedPost} 
            onSave={handleSave} 
            onCancel={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}; 