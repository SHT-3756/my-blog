import React from 'react'
import sanityClient from '@sanity/client';

export default function PostAll({slug}) {

    return (
        <div>
            <h1>Post: {slug}</h1>
        </div>
    )
}

 export async function getStaticPaths() {
       // sanity 로부터 데이터를 가져온다.
  const client = sanityClient({
    dataset: 'production',
    projectId: '44q526eh',
    useCdn: process.env.NODE_ENV === 'production',
  });


  const posts = await client.fetch(
    `
      *[_type == 'post']{
        title,
        subtitle,
        createdAt,
        'content': content[]{
          ...,
          ...select(_type == 'imageGallery' => {'images': images[]{..., 'url' : asset -> url}})
        },
        'sulg': slug.current,
        'thumbnail': {
          'alt': thumbnail.alt,
          'imageUrl': thumbnail.asset -> url
        },
        'author': author -> {
          name, 
          role,
          'image': image.asset -> url
        },
        'tag': tag -> {
          title,
          'slug': slug.current
        }
      }
    `
  );

  const paths = posts.map((post) => ({
      params: {
          slug: post.slug,
      },
  }));

     return {
         paths,
         fallback: false,
     };
}

 export function getStaticProps({params}) {
     const {slug} = params;
     return {
         props: {
             slug,
         },
     };
 }
