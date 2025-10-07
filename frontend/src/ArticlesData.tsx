export interface ArticleItem {
  context: string;
  highlight: string;
  href: string;
}

export interface Article {
  title: string;
  items: ArticleItem[];
}

export const articles: Article[] = [
  {
    title: "Create a group",
    items: [
      {
        context: "Platform admins can create skills, and link them to a user, a course or a path.",
        highlight: "user",
        href: "https://support.360learning.com/hc/articles/115001166383",
      },
      {
        context: "Platform admins can create skills, and link them to a user, a course or a path.",
        highlight: "course",
        href: "https://support.360learning.com/hc/articles/115001356626",
      },
      {
        context: "Platform admins can create skills, and link them to a user, a course or a path.",
        highlight: "path",
        href: "https://support.360learning.com/hc/articles/360056138772",
      },
    ],
  },
  {
    title: "Delete a path",
    items: [
      {
        context: "Administrators and authors can delete and archive paths they can edit. ",
        highlight: "edit",
        href: "https://example.com/delete/1",
      },
      {
        context: "Deleting a path removes it from the learners' statistics page. ",
        highlight: "learners' statistics page",
        href: "https://example.com/delete/2",
      },
    ],
  },
  {
    title: "Add users",
    items: [
      {
        context: "If users do not receive any notification, learn more about helping learners who don't receive notifications →.",
        highlight: "learn more about helping learners who don't receive notifications →",
        href: "https://example.com/add/1",
      },
    ],
  },
];