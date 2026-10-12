import { useState } from "react";
import { useNavigate } from "react-router";
import formFields from "./authFormFields.json";

const Login = () => {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch(
            "http://127.0.0.1:8000/api/login/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            }
        );

        const data = await response.json();
        
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        navigate("/layout");
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-slate-800">
                Login
            </h2>

            <div className="mt-4 border-2 border-blue-500 p-3 rounded-lg">

                <form
                    className="mt-4"
                    onSubmit={handleLogin}>

                    {formFields
                        .filter((field) => field.name !== "submit" && field.name !== "email")
                        .map((field) => (
                            <div
                                key={field.name}
                                className="mb-4"
                            >
                                <input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    className={field.classname}
                                    value={
                                        field.name === "username"
                                            ? username
                                            : password
                                    }
                                    onChange={(e) => {
                                        if (field.name === "username") {
                                            setUsername(e.target.value);
                                        } else if (field.name === "password") {
                                            setPassword(e.target.value);
                                        }
                                    }}
                                />
                            </div>
                        ))}

                    <button
                        type="submit"
                        className={
                            formFields.find(
                                (field) => field.name === "submit"
                            ).classname
                        }
                    >
                        {
                            formFields.find(
                                (field) => field.name === "submit"
                            ).value
                        }
                    </button>

                </form>
            </div>
        </div>
    );
};

export default Login;
