import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CiCircleRemove } from "react-icons/ci";
import { Helmet } from "react-helmet";

function AddNews() {
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [file, setFile] = useState<File | undefined>(undefined);

  const clickFile = () => {
    let file: HTMLInputElement | null = document.querySelector(".file");
    if (file != null) {
      file.click();
    }
  };

  const navigate = useNavigate();

  const addNews = async () => {
    let formData: FormData = new FormData();
    if (description.length > 180) {
      toast.info("Açıklamanın maksimum uzunluğu 180 karakterdir.");
      return;
    }
    if (title.length > 100) {
      toast.info("Başlığın maksimum uzunluğu 100 karakterdir.");
      return;
    }
    formData.append("description", description);
    formData.append("title", title);
    formData.append("upload", file!);
    await fetch("http://127.0.0.1:8000/api/news/add", {
      method: "POST",
      headers: {
        Authorization: "Token " + localStorage.getItem("key"),
      },
      body: formData,
    }).then(async (response: Response) => {
      if (response.status === 200) {
        toast.success("Haber başarıyla oluşturuldu. ✨");
        navigate("/news");
      } else if (response.status === 400) {
        let data: { msg_tr: string; msg_en: string } = await response.json();
        toast.error(data.msg_tr);
      }
    });
  };

  return (
    <div className="lg:px-10 px-4 without-header">
      <Helmet>
        <title>Haber Ekle • SportCom</title>
      </Helmet>
      <div className="grid place-items-center mt-10">
        <input
          type="text"
          placeholder="Haberin başlığı... ✨"
          maxLength={80}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          className="bg-[#EFEFEF]/50 p-2 mb-3 lg:w-2/5 w-4/5 outline-none border border-[#D9D9D9] shadow-md hover:shadow-lg duration-200 rounded-xl"
        />
        <textarea
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          className="bg-[#EFEFEF]/50 p-2 lg:w-2/5 w-4/5 outline-none border border-[#D9D9D9] shadow-md hover:shadow-lg duration-200 rounded-xl"
          rows={3}
          placeholder="Haberin açıklaması... 👾"
        ></textarea>
        <div className="lg:w-2/5 w-4/5 mt-1 text-sm italic">
          {description?.length}/180
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
            onClick={addNews}
            className="bg-[#37902F] mt-3 text-white py-[2px] px-8 shadow-md hover:shadow-lg duration-200 rounded-br-lg rounded-tl-lg"
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddNews;
