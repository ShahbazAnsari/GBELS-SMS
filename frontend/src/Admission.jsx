import { useState, useEffect } from "react";
import {getStudents, createStudent} from "./api/studentAPI";
import formFields from "./data/admissionForm.json";

function NewAdmission() {

  const [photo, setPhoto] = useState(null);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    student_id: "",
    first_name: "",
    last_name: "",
    father_name: "",
    date_of_birth: "",
    gender: "MALE",
    class_name: "",
    section: "",
    medium: "URDU",
    admission_date: "",
    status: "ACTIVE",
    picture: null,
  });

  useEffect(() => {

      const loadStudents = async () => {
          try {
              const data = await getStudents();

              setStudents(data);

              console.log("Students:", data);
          } catch (error) {
              console.error(error);
          }
      };

      loadStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhoto(URL.createObjectURL(file));
    }

    setFormData({
      ...formData,
      picture: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await createStudent(formData);

      console.log("Student created:", data);

      setFormData({
      student_id: "",
      first_name: "",
      last_name: "",
      father_name: "",
      date_of_birth: "",
      gender: "MALE",
      class_name: "",
      section: "",
      medium: "URDU",
      admission_date: "",
      status: "ACTIVE",
      picture: null,
    });

    setPhoto(null);
    } catch (error) {
      console.error("Create Student Error:", error);
    }
  };

  return (
    <div className=" bg-gray-100 border border-black shadow shadow-zinc-200 rounded-lg my-10">
       
          {/* <div className="w-full rounded-lg shadow"> */}

            <h1 className="text-3xl text-center pt-6 font-bold text-gray-800">
              New Admission
            </h1>

            <form className="grid grid-cols-2 gap-6 mt-6 p-6" onSubmit={handleSubmit}>

              {/* Your form fields here */}
              {formFields.map((field) => (
                <div
                  key={field.name}
                  className={field.colSpan === 2 ? "col-span-2" : ""}
                >

                  <label className="block font-medium mb-2">
                    {field.label}
                  </label>

                  {/* Text / Date / Other Inputs */}
                  {["text", "date", "email", "number"].includes(field.type) && (
                    <input
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="w-full border rounded p-2"
                    />
                  )}

                  {/* Select */}
                  {field.type === "select" && (
                    <select
                      name={field.name}
                      required={field.required}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="w-full border rounded p-2"
                      >
                      <option value="">
                        Select {field.label}
                      </option>

                      {field.options.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Textarea */}
                  {field.type === "textarea" && (
                    <textarea
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows="3"
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="w-full border rounded p-2"
                    />
                  )}

                  {/* Image Holder */}
                  {field.type === "image" && (
                    <>
                      <div className="w-40 h-48 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center overflow-hidden">

                        {photo ? (
                          <img
                            src={photo}
                            alt={field.label}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm text-center">
                            No Photo
                          </span>
                        )}

                      </div>

                      <input
                        type="file"
                        accept={field.accept}
                        onChange={handlePhotoChange}
                        className="mt-3"
                      />
                    </>
                  )}

                </div>
              ))}

              <div className="col-span-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded"
                >
                  Submit Admission
                </button>
              </div>

            </form>

          {/* </div> */}
    </div>
  );
}

export default NewAdmission;