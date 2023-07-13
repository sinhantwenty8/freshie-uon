import { FunctionComponent, useState } from "react";
import { getStorage, ref, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { Button } from "@mui/material";
import Save from "@mui/icons-material/Save";

interface editstoriesProps {

}

const Editstories: FunctionComponent<editstoriesProps> = () => {
    const [image, setimage] = useState(null as File | null);
    const [imageurl, setimageurl] = useState("");
    const editheader = async () => {
        const docRef = doc(getFirestore(), "blogs-header", "mainpageheader");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }

        const storage = getStorage();
        const storageRef = ref(storage, '/blogs/header/mainpageheader.png');

        // 'file' comes from the Blob or File API
        const snapshot = await uploadBytes(storageRef, image!);
        const imgurl = await getDownloadURL(snapshot.ref);

        await setDoc(doc(getFirestore(), "blogs-header", "mainpageheader"), {
            imageurl: imgurl,
        });
    }

    return (<div>
        <Button style={{ margin: '0 0 10px 0', backgroundColor: '#86A7D3' }} variant="contained" component="label">Change header<input hidden accept="image/*" multiple type="file" onChange={(e) => { setimage(e.target.files![0]); setimageurl(URL.createObjectURL(e.target.files![0])) }} />
        </Button>
        <div style={{ margin: '0 0 10px 0' }}  >{image ?
            <div style={{ color: 'green' }}>Image inserted <br /><img src={imageurl} alt="image photo" width={400} height={400} style={{ objectFit: "cover" }} />
            </div> : <div></div>}
        </div>
        <Button variant="contained" style={{ backgroundColor: '#86A7D3' }} endIcon={<Save />} onClick={() => editheader()}>
            Save
        </Button>
    </div>);
}

export default Editstories;