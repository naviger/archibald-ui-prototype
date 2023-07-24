import { Contact } from "./Contact";

export type Entity = {
  type: string,
  name: string,
  identifier: string,
  contact: Array<Contact>
}