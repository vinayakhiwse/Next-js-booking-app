import { db, storage } from "@/config/firebaseConfig";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// Function to get Collection All data
export function getStaticData(COLLECTION) {
  return new Promise((resolve, reject) => {
    try {
      const Query = collection(db, COLLECTION);
      onSnapshot(Query, (querySnapshot) => {
        resolve(querySnapshot.docs.map((d) => ({ docid: d.id, ...d.data() })));
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Function to Create or Update Doc
export function Create_Update_Doc(COLLECTION, DATA) {
  return new Promise((resolve, reject) => {
    try {
      const newDocRef = doc(collection(db, COLLECTION));
      setDoc(newDocRef, DATA).then(() => {
        resolve("data.insert");
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Image Uploading
export const imageUploading = (UPLOAD_PATH, FILE) => {
  return new Promise(async (resolve, reject) => {
    try {
      const imageRef = ref(storage, `${UPLOAD_PATH}/${FILE?.name}`);
      const uploadTask = uploadBytesResumable(imageRef, FILE);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (err) => {}
      );
      await uploadTask;
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      resolve(downloadURL);
    } catch (error) {
      reject(error);
    }
  });
};
