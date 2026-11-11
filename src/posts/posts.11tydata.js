const unpublished = data => data.draft || new Date(data.date) > new Date();
export default {
  eleventyComputed: {
    layout: data => unpublished(data) ? false : 'post.njk',
    permalink: data => unpublished(data) ? false : `/posts/${data.page.fileSlug}/`
  }
};
