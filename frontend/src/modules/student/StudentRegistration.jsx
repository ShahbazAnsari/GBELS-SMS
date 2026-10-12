import { useState, useEffect } from "react";

import {
  Plus,
  MapPin,
  RotateCcw,
  UserRound,
  Check,
  ContactRound,
  School,
  BookOpen,
  UsersRound,
  Camera,
  ClipboardList,
  LoaderCircle,
} from "lucide-react";

import { getStudents, createStudent } from "./api/studentAPI";
import { createAddress } from "../../api/addressAPI";

import { getAdmissionTypes } from "../control-panel/school-settings/api/admissionTypeAPI.js";
import { getClasses } from "../control-panel/school-settings/api/classAPI.js";
import { getSections } from "../control-panel/school-settings/api/sectionAPI.js";
import { getMediums } from "../control-panel/school-settings/api/mediumAPI.js";

import AddressForm from "../../components/AddressForm";
import admissionFormFields from "./admissionForm.json";

// Initial form data
const initialFormData = {
  student_id: "",
  gr_no: "",
  first_name: "",
  last_name: "",
  surname: "",
  dob: "",
  gender: "MALE",
  religion: "",
  b_form_crc: "",
  nationality: "",

  father_name: "",
  father_mother_cnic: "",
  guardian_name: "",
  guardian_cnic: "",
  guardian_relation: "",
  parent_guardian_email: "",

  contact_no: "",
  emergency_contact_no: "",

  address: {
    province: "",
    district: "",
    taluka: "",
    union_council: "",
    city_town: "",
    area_locality: "",
    house_no_street: "",
    postal_code: "",
  },

  admission_type: "",
  student_class: "",
  section: "",
  medium: "",
  date_of_admission: "",
  student_status: "",

  previous_school: "",
  previous_class: "",
  last_gr_no: "",

  picture: null,
};

// Section icons
// Names must match admissionForm.json section names.
const sectionIcons = {
  "Personal Information": UserRound,
  "Contact Information": ContactRound,
  "School / Admission Information": School,
  "Previous School Information": BookOpen,
  "Parent / Guardian Information": UsersRound,
  "Student Picture": Camera,
};

function StudentRegistration() {
  const [photo, setPhoto] = useState(null);

  const [students, setStudents] = useState([]);
  
  const [admissionTypes, setAdmissionTypes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [mediums, setMediums] = useState([]);

  const [formData, setFormData] = useState({
    ...initialFormData,
    address: { ...initialFormData.address },
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Input styling
  const inputClass =
    "w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-400  focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  // Load dropdown data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          studentsData,
          admissionTypesData,
          classesData,
          sectionsData,
          mediumsData,
        ] = await Promise.all([
          getStudents(),
          getAdmissionTypes(),
          getClasses(),
          getSections(),
          getMediums(),
        ]);

        setStudents(studentsData);
        setAdmissionTypes(admissionTypesData);
        setClasses(classesData);
        setSections(sectionsData);
        setMediums(mediumsData);
      } catch (error) {
        console.error("Error loading student registration data:", error);
        setErrorMessage("Unable to load registration data.");
      }
    };

    loadData();
  }, []);

  // Automatically hide notifications after 3 seconds
  useEffect(() => {
    if (!successMessage && !errorMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  // Handle normal form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Handle address fields
  const handleAddressChange = (fieldName, value) => {
    setFormData((previousData) => ({
      ...previousData,
      address: {
        ...previousData.address,
        [fieldName]: value,
      },
    }));
  };

  // Handle student picture
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0] || null;

    setPhoto(file ? URL.createObjectURL(file) : null);

    setFormData((previousData) => ({
      ...previousData,
      picture: file,
    }));
  };

  // Get dropdown options
  const getOptions = (field) => {
    switch (field.name) {
      case "admission_type":
        return admissionTypes;

      case "student_class":
      case "previous_class":
        return classes;

      case "section":
        return sections;

      case "medium":
        return mediums;

      default:
        return field.options || [];
    }
  };

  // Get dropdown option value
  const getOptionValue = (field, option) => {
    if (
      ["admission_type", "student_class", "section", "medium", "previous_class"].includes(
        field.name,
      )
    ) {
      return option.id;
    }

    return option.value;
  };

  // Get dropdown option label
  const getOptionLabel = (field, option) => {
    switch (field.name) {
      case "admission_type":
        return option.admission_type_name;

      case "student_class":
      case "previous_class":
        return option.class_name;

      case "section":
        return option.section_name;

      case "medium":
        return option.medium_name;

      default:
        return option.label;
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      ...initialFormData,
      address: { ...initialFormData.address },
    });

    setPhoto(null);
    setSuccessMessage("");
    setErrorMessage("");
  };

  // Submit admission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // STEP 1: Save Address first
      console.log("Saving Address:", formData.address);

      const addressData = await createAddress(formData.address);

      console.log("Address created:", addressData);

      // Confirm that the backend returned an Address ID.
      if (!addressData?.id) {
        throw new Error(
          "Address was saved, but the server did not return its ID.",
        );
      }

      // STEP 2: Prepare Student data with the Address ID
      const studentData = {
        ...formData,
        address: addressData.id,
      };

      console.log("Saving Student:", studentData);

      // STEP 3: Save Student
      const result = await createStudent(studentData);

      console.log("Student created:", result);

      // STEP 4: Reset form after successful admission
      setFormData({
        ...initialFormData,
        address: { ...initialFormData.address },
      });

      setPhoto(null);

      e.target.reset();

      setSuccessMessage("Student admission submitted successfully!");

      // STEP 5: Refresh student list
      try {
        const updatedStudents = await getStudents();
        setStudents(updatedStudents);
      } catch (refreshError) {
        console.error("Error refreshing students:", refreshError);
      }
    } catch (error) {
      console.error("Admission Submission Error:", error);

      setErrorMessage(
        error?.message || "Failed to submit admission. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate continuous field numbering across all JSON sections
  let fieldCounter = 0;

  return (
    <div className="mx-auto my-6 w-full max-w-[1600px] px-3 sm:px-5 lg:px-8">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        {/* Main Header */}
        <div className="bg-linear-to-r from-blue-800 via-blue-700 to-indigo-700 px-5 py-7 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                School Management System
              </p>

              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Student Registration
              </h1>

              <p className="mt-2 text-sm text-blue-100">
                Complete the student information to register a new admission.
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white">
              <Plus size={28} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        {(successMessage || errorMessage) && (
          <div className="px-5 pt-5 sm:px-8">
            <div
              role="alert"
              className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                successMessage
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {successMessage || errorMessage}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 p-4 sm:p-6 lg:p-8">
          {/* Dynamic JSON Sections */}
          {admissionFormFields.map((form, sectionIndex) => {
            const SectionIcon = sectionIcons[form.section] || ClipboardList;

            return (
              <section
                key={form.section}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                {/* Section Header */}
                <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <SectionIcon size={22} strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-gray-800 sm:text-lg">
                      {form.section}
                    </h2>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Section {String(sectionIndex + 1).padStart(2, "0")} •{" "}
                      {form.fields.length} fields
                    </p>
                  </div>
                </div>

                {/* Three-column responsive field layout */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
                  {form.fields.map((field) => {
                    fieldCounter += 1;

                    const fieldNumber = String(fieldCounter).padStart(2, "0");

                    return (
                      <div
                        key={field.name}
                        className={`min-w-0 ${
                          field.colSpan === 3
                            ? "sm:col-span-2 xl:col-span-3"
                            : field.colSpan === 2
                              ? "sm:col-span-2"
                              : ""
                        }`}
                      >
                        {/* Field Caption with Serial Number */}
                        <label
                          htmlFor={field.name}
                          className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
                        >
                          {/* <span className="inline-flex h-6 min-w-7 shrink-0 items-center justify-center rounded-md bg-gray-100 px-1.5 text-xs font-bold text-gray-500">
                            {fieldNumber}  // field numbering
                          </span> */}

                          <span>{field.label}</span>

                          {field.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>

                        {/* Text, Date, Email, Number and Telephone */}
                        {["text", "date", "email", "number", "tel"].includes(
                          field.type,
                        ) && (
                          <input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            placeholder={
                              field.placeholder || `Enter ${field.label}`
                            }
                            readOnly={field.readOnly || false}
                            required={field.required}
                            value={formData[field.name] ?? ""}
                            onChange={handleChange}
                            className={`${inputClass} ${
                              field.readOnly
                                ? "cursor-not-allowed bg-gray-100"
                                : ""
                            }`}
                          />
                        )}

                        {/* Select Dropdown */}
                        {field.type === "select" && (
                          <select
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            value={formData[field.name] ?? ""}
                            onChange={handleChange}
                            className={inputClass}
                          >
                            <option value="">Select {field.label}</option>

                            {getOptions(field).map((option) => {
                              const optionValue = getOptionValue(field, option);

                              const optionLabel = getOptionLabel(field, option);

                              return (
                                <option key={optionValue} value={optionValue}>
                                  {optionLabel}
                                </option>
                              );
                            })}
                          </select>
                        )}

                        {/* Textarea */}
                        {field.type === "textarea" && (
                          <textarea
                            id={field.name}
                            name={field.name}
                            placeholder={
                              field.placeholder || `Enter ${field.label}`
                            }
                            required={field.required}
                            rows={3}
                            value={formData[field.name] ?? ""}
                            onChange={handleChange}
                            className={`${inputClass} resize-y`}
                          />
                        )}

                        {/* Student Picture */}
                        {field.type === "file" && (
                          <div className="flex flex-col items-start gap-3">
                            <div
                              className="flex items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50"
                              style={{
                                width: field.width || "150px",
                                height: field.height || "175px",
                              }}
                            >
                              {photo ? (
                                <img
                                  src={photo}
                                  alt="Student preview"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-400">
                                  <UserRound size={42} strokeWidth={1.3} />

                                  <span className="text-xs font-medium">
                                    No Photo Selected
                                  </span>
                                </div>
                              )}
                            </div>

                            <input
                              id={field.name}
                              name={field.name}
                              type="file"
                              accept={field.accept || "image/*"}
                              required={field.required}
                              onChange={handlePhotoChange}
                              className="block w-full min-w-0 text-xs text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Address Section */}
                {form.section === "Contact Information" && (
                  <div className="border-t border-gray-200">
                    {/* Address Header */}
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-4 sm:px-6">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                        <MapPin size={22} strokeWidth={1.8} />
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-gray-800">
                          Address Details
                        </h3>

                        <p className="mt-0.5 text-xs text-gray-500">
                          Enter the student's residential address.
                        </p>
                      </div>
                    </div>

                    {/* Address Fields */}
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
                      <AddressForm
                        address={formData.address}
                        onChange={handleAddressChange}
                      />
                    </div>
                  </div>
                )}
              </section>
            );
          })}

          {/* Form Footer */}
          <div className="flex flex-col-reverse gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-s leading-5 text-gray-500">
              Fields marked with{" "}
              <span className="font-bold text-red-500">*</span> are required.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Reset Button */}
              <button
                type="button"
                disabled={loading}
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw size={17} />
                Reset Form
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check size={19} />
                    Submit Admission
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentRegistration;
