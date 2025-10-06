export interface ArticleItem {
  context: string;
  highlight: string;
  link: string;
  status: number;
  openingBehavior: string;
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
        link: "https://support.360learning.com/hc/articles/115001166383",
        status: 200,
        openingBehavior: "Same tab",
      },
      {
        context: "Platform admins can create skills, and link them to a user, a course or a path.",
        highlight: "course",
        link: "https://support.360learning.com/hc/articles/115001356626",
        status: 200,
        openingBehavior: "Same tab",
      },
      {
        context: "Platform admins can create skills, and link them to a user, a course or a path.",
        highlight: "path",
        link: "https://support.360learning.com/hc/articles/360056138772",
        status: 400,
        openingBehavior: "Same tab",
      },
    ],
  },
  {
    title: "Delete a path",
    items: [
      {
        context: "Administrators and authors can delete and archive paths they can edit. ",
        highlight: "edit",
        link: "https://example.com/delete/1",
        status: 200,
        openingBehavior: "Same tab",
      },
      {
        context: "Deleting a path removes it from the learners' statistics page. ",
        highlight: "learners' statistics page",
        link: "https://example.com/delete/2",
        status: 200,
        openingBehavior: "New tab",
      },
    ],
  },
  {
    title: "Add users",
    items: [
      {
        context: "If users do not receive any notification, learn more about helping learners who don't receive notifications →.",
        highlight: "learn more about helping learners who don't receive notifications →",
        link: "https://example.com/add/1",
        status: 400,
        openingBehavior: "Same tab",
      },
    ],
  },
];