import { useState } from "react";

const InputModal = ({ title, inputs = [], onSubmit, onCancel }) => {
  const [formValues, setFormValues] = useState(() =>
    inputs.reduce((acc, input) => {
      // file inputs khởi tạo null
      acc[input.name] =
        input.type === "file" ? null : input.defaultValue || "";
      return acc;
    }, {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, name) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: e.target.files[0] || null,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formValues);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[500px] max-w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {inputs.map((input) => (
          <div key={input.name} className="mb-4">
            <label className="block mb-1 font-medium">{input.label}</label>

            {/* nếu là file, không dùng value, chỉ dùng onChange files */}
            {input.type === "file" ? (
              <input
                type="file"
                name={input.name}
                accept={input.accept}
                onChange={(e) => handleFileChange(e, input.name)}
                className="w-full"
              />
            ) : (
              <input
                type={input.type || "text"}
                name={input.name}
                value={formValues[input.name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            )}
          </div>
        ))}

        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputModal;



// import { useState } from "react";

// const InputModal = ({ title, inputs = [], onSubmit, onCancel }) => {
//   const [formValues, setFormValues] = useState(() =>
//     inputs.reduce((acc, input) => {
//       acc[input.name] = input.defaultValue || "";
//       return acc;
//     }, {})
//   );

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = () => {
//     onSubmit(formValues);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//       <div className="bg-white rounded-xl shadow-xl p-6 w-[500px] max-w-full">
//         <h2 className="text-xl font-bold mb-4">{title}</h2>

//         {inputs.map((input) => (
//           <div key={input.name} className="mb-4">
//             <label className="block mb-1 font-medium">{input.label}</label>
//             <input
//               type={input.type || "text"}
//               name={input.name}
//               value={input.type === "file" ? undefined : formValues[input.name]}
//               onChange={
//                 input.type === "file"
//                   ? (e) =>
//                       setFormValues((prev) => ({
//                         ...prev,
//                         [input.name]: e.target.files[0],
//                       }))
//                   : handleChange
//               }
//               accept={input.accept}
//               className="w-full border border-gray-300 rounded px-3 py-2"
//             />
//           </div>
//         ))}

//         <div className="flex justify-end gap-3 mt-4">
//           <button
//             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//             onClick={onCancel}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//             onClick={handleSubmit}
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InputModal;
