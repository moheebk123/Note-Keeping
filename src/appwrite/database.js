import { Client, Databases, Query, ID, Permission, Role } from "appwrite";
import config from "../configuration/configuration.js";

export class DatabaseService {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(config.appWriteUrl)
      .setProject(config.appWriteProjectId);
    this.databases = new Databases(this.client);
  }

  // Return a Single Note
  async getNote(id) {
    try {
      const doc = await this.databases.getDocument(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        id
      );
      const lastedit = doc.$updatedAt ? doc.$updatedAt : doc.$createdAt;
      const note = {
        id: doc.$id,
        title: doc.title,
        tagline: doc.tagline,
        content: doc.content,
        pinned: doc.pinned,
        lastedit: lastedit,
      };
      return note;
    } catch (error) {
      return `Error : ${error}`;
    }
  }

  // Return Unpinned Notes
  async getNotes(query = [Query.equal("pinned", false)]) {
    try {
      const res = await this.databases.listDocuments(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        query
      );
      const docs = res.documents;
      const notes = docs.map((doc) => {
        const lastedit = doc.$updatedAt ? doc.$updatedAt : doc.$createdAt;
        return {
          id: doc.$id,
          title: doc.title,
          tagline: doc.tagline,
          content: doc.content,
          pinned: doc.pinned,
          lastedit: lastedit,
        };
      });
      return notes;
    } catch (error) {
      return `Error : ${error}`;
    }
  }

  // Return Pinned Notes in Descending Order by Last Updated Date
  async getPinnedNotes(
    query = [Query.equal("pinned", true), Query.orderDesc("$updatedAt")]
  ) {
    try {
      const res = await this.databases.listDocuments(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        query
      );
      const docs = res.documents;
      const pinnedNotes = docs.map((doc) => {
        const lastedit = doc.$updatedAt ? doc.$updatedAt : doc.$createdAt;
        return {
          id: doc.$id,
          title: doc.title,
          tagline: doc.tagline,
          content: doc.content,
          pinned: doc.pinned,
          lastedit: lastedit,
        };
      });
      return pinnedNotes;
    } catch (error) {
      return `Error : ${error}`;
    }
  }

  // Create a New Note in Database
  async createNote(newNote) {
    if (
      newNote.title.length !== 0 &&
      newNote.tagline.length !== 0 &&
      newNote.content.length !== 0
    ) {
      try {
        await this.databases.createDocument(
          config.appWriteDatabaseId,
          config.appWriteCollectionId,
          ID.unique(),
          newNote
        );
        return true;
      } catch (error) {
        return `Error ${error}`;
      }
    } else {
      return "Fill required fields to proceed.";
    }
  }

  // Update Note in Database
  async updateNote(id, updatedNote) {
    try {
      const note = await this.getNote(id);
      if (note) {
        const updatable =
          note.title === updatedNote.title &&
          note.tagline === updatedNote.tagline &&
          note.content === updatedNote.content &&
          note.pinned === updatedNote.pinned;
        if (updatable) {
          return "Nothing to Change.";
        } else {
          await this.databases.updateDocument(
            config.appWriteDatabaseId,
            config.appWriteCollectionId,
            id,
            {
              title: updatedNote.title,
              tagline: updatedNote.tagline,
              content: updatedNote.content,
              pinned: updatedNote.pinned,
            },
            [Permission.read(Role.any())]
          );
          return true;
        }
      } else {
        return note;
      }
    } catch (error) {
      return `Error : ${error}`;
    }
  }

  // Delete Note from Database
  async deleteNote(id) {
    try {
      await this.databases.deleteDocument(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        id
      );
      return true;
    } catch (error) {
      return `Error : ${error}`;
    }
  }
}

const databaseService = new DatabaseService();
export default databaseService;
