import { Delete, InterestsRounded } from "@mui/icons-material";
import { Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { FunctionComponent, useEffect, useState } from "react";
import Link from 'next/link';

interface categories {
    name: string;
    id: string;
}

interface listCategoriesProps {

}

const listCategories: FunctionComponent<listCategoriesProps> = () => {
    const [list, setlist] = useState([] as categories[]);
    const [filtered, setfiltered] = useState("");
    const loadcategories = async () => {
        const querySnapshot = await getDocs(collection(getFirestore(), "category"));
        const category = [] as categories[];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            category.push({ id: doc.id, ...doc.data() } as categories);

        });
        console.log(category);
        setlist(category);
    }

    const changecategories = async (id: string, newName: string) => {
        const docRef = doc(getFirestore(), "category", id);
        await updateDoc(docRef, { name: newName });
        loadcategories();
    }

    const deletecategories = async (id: string) => {
        const docRef = doc(getFirestore(), "category", id);
        await deleteDoc(docRef);
        loadcategories();
    }

    const searchchange = async (id: string, newName: string) => {
        const docRef = doc(getFirestore(), "category", id);
        await updateDoc(docRef, { name: newName });
        loadcategories();
    }

    useEffect(() => {
        setTimeout(() => {
            loadcategories();
        }, 100);
    }, []);

    const filteredCategories = list.filter(category =>
        category.name.toLowerCase().includes(filtered.toLowerCase())
    );

    return (
        <div style={{ padding: 20 }}>
            <Grid container spacing={2}>
                <Grid item xs={11}>
                    <TextField
                        label="Filter by category"
                        variant="outlined"
                        value={filtered}
                        onChange={(e) => setfiltered(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={1}>
                    <Link href="/categories/add">
                        <Button variant="contained" fullWidth style={{ height: '100%' }}>
                            <AddIcon />
                        </Button>
                    </Link>

                </Grid>
            </Grid>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Category Name</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCategories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell component="th" scope="row">
                                    <TextField
                                        id={category.id}
                                        variant="outlined"
                                        value={category.name}
                                        onChange={(e) => searchchange(category.id, e.target.value)}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Button onClick={() => deletecategories(category.id)}>
                                        <DeleteIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default listCategories;

