import { mockContents } from "./content.mock";
import { mockContentComments } from "./content-comments.mock";
import { mockUsers } from "./users.mock";

export const mockStore = {
  users: [...mockUsers],
  contents: [...mockContents],
  comments: [...mockContentComments],
  currentUser: mockUsers[0],
};
