import { useState } from "react";
import { CiCircleRemove } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

function AddPost() {
  const [text, setText] = useState<string>("");
  const [file, setFile] = useState<File | undefined>(undefined);

  const clickFile = () => {
    let file: HTMLInputElement | null = document.querySelector(".file");
    if (file != null) {
      file.click();
    }
  };

  const navigate = useNavigate();

  const addPost = async () => {
    let formData: FormData = new FormData();
    formData.append("text", text);
    formData.append("upload", file!);
    await fetch("http://127.0.0.1:8000/api/post/add", {
      method: "POST",
      headers: {
        Authorization: "Token " + localStorage.getItem("key"),
      },
      body: formData,
    }).then(async (response: Response) => {
      if (response.status === 200) {
        toast.success("Gönderiniz başarıyla oluşturuldu. ✨");
        navigate("/post/all");
      }
    });
  };

  return (
    <div className="lg:px-10 px-4 without-header">
      <Helmet>
        <title>Gönderi Ekle • SportCom</title>
      </Helmet>
      <div className="grid place-items-center mt-10">
        <textarea
          onChange={(e) => {
            setText(e.target.value);
          }}
          className="bg-[#EFEFEF]/50 p-2 lg:w-2/5 w-4/5 outline-none border border-[#D9D9D9] shadow-md hover:shadow-lg duration-200 rounded-xl"
          rows={3}
          placeholder="Anlatmak istedikleriniz... 🤨"
        ></textarea>
        <div className="lg:w-2/5 w-4/5 mt-1 text-sm italic">
          {text?.length}/180
        </div>
        <div className="lg:w-2/5 mt-2 w-4/5 bg-[#EFEFEF]/50 p-1 border border-[#D9D9D9] shadow-md hover:shadow-lg duration-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="shadow-inner cursor-pointer w-32 border border-[#D9D9D9] rounded-lg text-sm p-1"
                onClick={clickFile}
              >
                {file ? <p>Dosyayı Değiştir</p> : <p>Dosya Seçin</p>}
              </div>
              {file ? <p>{file.name}</p> : null}
            </div>

            {file ? (
              <CiCircleRemove
                className="cursor-pointer"
                onClick={() => {
                  setFile(undefined);
                }}
                color="red"
                size={18}
              />
            ) : null}
          </div>
          <input
            onChange={(e) => {
              setFile(e.target.files ? e.target.files[0] : undefined);
            }}
            type="file"
            className="hidden file"
          />
        </div>
        <div className="lg:w-2/5 w-4/5 flex justify-end">
          <button
            onClick={addPost}
            className="bg-[#37902F] mt-3 text-white py-[2px] px-8 shadow-md hover:shadow-lg duration-200 rounded-br-lg rounded-tl-lg"
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPost;
