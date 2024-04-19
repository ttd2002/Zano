import { useState } from "react";
import toast from "react-hot-toast";
// const formatDateToString = (date) => {
//     const d = new Date(date);
//     const year = d.getFullYear();
//     const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
//     const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
//     return `${month}/${day}/${year}`;
//   };
const useSignup = (navigate) => {
  const [loading, setLoading] = useState(false);
  const signup = async ({
    name,
    phone,
    password,
    confirmPassword,
    gender,
    birthDate,
    avatar
  }) => {
    const success = handleInputError({
      name,
      phone,
      password,
      confirmPassword,
      gender,
      birthDate,
      avatar
    });
    if (!success) return;
    setLoading(true);
    try {
        const res = await fetch("http://localhost:3000/auth/register",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              phone,
              password,
              confirmPassword,
              gender,
              birthDate,
              avatar,
            })
          
        })

        const data = await res.json();
        if (res.ok) {
          // Đăng ký thành công
          localStorage.setItem("chat-user", JSON.stringify(data));
          // console.log(data);
          toast.success("Đăng ký thành công");
          localStorage.setItem("SigupUser", JSON.stringify({ phone, password }));

          setTimeout(() => {
            navigate("/auth/login"); // Chuyển hướng tới trang login bằng navigate
          },2000);
        } else {
          // Xử lý lỗi từ phía server
          const errorMessage = data.error || "Có lỗi xảy ra khi đăng ký";
          throw new Error(errorMessage);
        }
      } catch (error) {
        // Xử lý lỗi nếu không kết nối được server hoặc server trả về lỗi không mong muốn
        console.error(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
  };

  return {loading, signup};

};

export default useSignup;

function handleInputError({
  name,
  phone,
  password,
  confirmPassword,
  gender,
  birthDate,
  avatar
}) {
  if (
    !name ||
    !phone ||
    !password ||
    !confirmPassword ||
    !gender 
    
  ) {
    toast.error("Please fill in all fields");
    return false;
  }
  if (password !== confirmPassword) {
    toast.error("Password is not match");
    return false;
  }
  if (password.length < 6) {
    toast.error("Password must be at least 8 characters long");
    return false;
  }
  return true;
}
