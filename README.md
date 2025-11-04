# Wedding Photo Upload Website

A simple and elegant photo upload and viewing website for wedding guests to share and view photos from your special day.

## Features

- Secure access with query parameter key (`?key=monkeywedding26`)
- Drag-and-drop photo upload
- Multi-photo upload support
- Responsive photo gallery with grid layout
- Full-screen photo viewer
- Real-time photo gallery updates after upload

## Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Backend**: Supabase (Storage + Database)
- **Styling**: CSS with responsive design

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

#### Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Name it: `wedding-photos`
5. Make it **Public** (important for viewing photos)
6. Click **Create bucket**

#### Set Bucket Policies

After creating the bucket, you need to set up policies to allow public read and authenticated write:

1. Click on the `wedding-photos` bucket
2. Go to **Policies** tab
3. Click **New Policy**

**Policy 1: Allow public read access**
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'wedding-photos');
```

**Policy 2: Allow anyone to upload**
```sql
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'wedding-photos');
```

Or use the Supabase dashboard policy builder:
- Select "Custom" policy
- For SELECT: Allow all users to read
- For INSERT: Allow all users to upload

### 3. Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your Supabase credentials in `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project settings:
- Go to **Project Settings** > **API**
- Copy the **Project URL** and **anon/public** key

### 4. Run the Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### 5. Access the Site

To access the site, you need to include the query parameter:
```
http://localhost:5173?key=monkeywedding26
```

Without the correct key, access will be denied.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready to deploy to any static hosting service (Vercel, Netlify, etc.).

## Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Share the URL with the key: `https://your-domain.com?key=monkeywedding26`

## Security Note

The query parameter key provides basic access control. Once users access the site with the correct key, their access is stored in sessionStorage, so they don't need to include the query parameter on every page load during their session.

For enhanced security in production, consider:
- Using Supabase Row Level Security (RLS)
- Implementing proper authentication
- Setting up CORS policies in Supabase

## Customization

- Change the wedding key in `src/components/AuthWrapper.tsx` (line 8)
- Modify colors and styling in `src/App.css` and `src/index.css`
- Update the title in `index.html`

## Support

If you encounter any issues:
1. Check that your Supabase bucket is public
2. Verify your environment variables are correct
3. Ensure storage policies are properly configured
4. Check browser console for any errors
