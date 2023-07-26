import { FormEvent, FunctionComponent, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Button, Grid, TextField } from "@mui/material";
import Box from '@mui/material/Box';
import LoginIcon from '@mui/icons-material/Login';
import styles from './login.module.css'
interface loginProps {

}

const Login: FunctionComponent<loginProps> = () => {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [errstate, seterrstate] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
            console.log("Logged in user:", userCredential.user);
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <div className={styles.background}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                <div style={{backgroundImage: `url(/loginpage2.png)`, width: 1000, height: 1000}}></div>
                </Grid>
                <Grid item xs={12} md={6}>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
                            <div className={styles.welcome}>Welcome!</div>
                            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" marginTop="30px" sx={{
                                backgroundColor: '#ECEFED', width: '38vw',
                                height: '40vh',
                            }}>
                                <TextField
                                    error={errstate}
                                    label="Email"
                                    value={email}
                                    variant="filled"
                                    onChange={(e) => setemail(e.target.value)}
                                    sx={{ width: 500, height: 48, marginBottom: 2 }}
                                />
                                <TextField
                                    error={errstate}
                                    label="Password"
                                    value={password}
                                    type="password"
                                    variant="filled"
                                    onChange={(e) => setpassword(e.target.value)}
                                    sx={{ width: 500, height: 48, marginBottom: 2}}
                                />
                                <Button type="submit" variant="contained" color="primary" sx={{ width: 500, height: 48, backgroundColor: '#1F304A', color: '#E3E2E1' }}>
                                    Login
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Grid>
            </Grid>
        </div>
    );
}
export default Login;