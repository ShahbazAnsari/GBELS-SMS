import formFields from "../data/authFormFields.json";

const Register = () => {
    return (
        <div>
            <h2 className="text-xl font-bold text-slate-800">Registration</h2>
            <div className="mt-4 border-b-2 border-blue-500 pb-2">
            <form className="mt-4 border-b-2">
                {formFields.map((field) => (
                    <div key={field.name} className="mb-4">
                        <input
                            type={field.type}
                            placeholder={field.placeholder}
                            className="border border-slate-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                ))}   
            </form>
            </div>
        </div>
    )
}

export default Register