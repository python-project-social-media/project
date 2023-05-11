import { useContext, useState, useEffect } from "react";
import { CiCircleRemove } from "react-icons/ci";
import { MdInsertPhoto } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "../../context/context";
import { News as NewsI } from "../../interfaces/News";
import { Helmet } from "react-helmet";

function UpdateNews() {
  const params = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [news, setNews] = useState<NewsI>();
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | string | undefined>();

  const clickFile = () => {
    let file: HTMLInputElement | null = document.querySelector(".file");
    if (file != null) {
      file.click();
    }
  };

  useEffect(() => {
    GetNews();
  }, [params]);

  const GetNews = async () => {
    await fetch(`http://127.0.0.1:8000/api/news/${params.id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }).then(async (resp: Response) => {
      let data: { data: NewsI } = await resp.json();
      setNews(data.data);
    });
  };

  const updateNews = async () => {
    let formData: FormData = new FormData();
    formData.append("title", document.querySelector(".title")?.value);
    formData.append(
      "description",
      document.querySelector(".description")?.value
    );
    if (file) {
      formData.append("upload", file!);
    }

    formData.append("delete", document.querySelector(".checkobox")?.checked);

    await fetch(`http://127.0.0.1:8000/api/news/${params.id}/update`, {
      method: "PUT",
      headers: {
        Authorization: "Token " + localStorage.getItem("key"),
      },
      body: formData,
    }).then(async (response: Response) => {
      if (response.status === 200) {
        toast.success("Gönderiniz başarıyla güncellendi. ⚡");
        navigate("/news");
      }
    });
  };

  return (
    <div className="lg:px-10 px-4 without-header">
      <Helmet>
        <title>Haberi Güncelle • SportCom</title>
      </Helmet>
      <div className="grid place-items-center mt-10">
        <input
          type="text"
          placeholder="Haberin başlığı... ✨"
          maxLength={80}
          defaultValue={news?.title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          className="bg-[#EFEFEF]/50 title p-2 mb-3 lg:w-2/5 w-4/5 outline-none border border-[#D9D9D9] shadow-md hover:shadow-lg duration-200 rounded-xl"
        />
        <textarea
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          className="bg-[#EFEFEF]/50 p-2 description lg:w-2/5 w-4/5 outline-none border border-[#D9D9D9] shadow-md hover:shadow-lg duration-200 rounded-xl"
          rows={3}
          placeholder="Haberin açıklaması... 👾"
          defaultValue={news?.description}
        ></textarea>
        <div className="lg:w-2/5 w-4/5 mt-1 text-sm italic">
          {description?.length}/180
        </div>
        <div className="lg:w-2/5 mt-2 w-4/5 bg-[#EFEFEF]/50 p-1 border border-[#D9D9D9] shadow-md hover:shadow-lg duration-200 rounded-lg">
          {news?.image ? (
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-1">
                <MdInsertPhoto /> <span>mevcut dosya : {news?.image}</span>
              </div>
              <div className="flex items-center gap-1">
                <input type="checkbox" className="checkobox" />
                <span className="text-sm">Kaldır</span>
              </div>
            </div>
          ) : null}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="shadow-inner cursor-pointer w-32 border border-[#D9D9D9] rounded-lg text-sm p-1"
                onClick={clickFile}
              >
                {file ? <p>Dosyayı Değiştir</p> : <p>Dosya Seçin</p>}
              </div>
              {file ? <span>{file.name}</span> : null}
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
            onClick={updateNews}
            className="bg-[#37902F] mt-3 text-white py-[2px] px-8 shadow-md hover:shadow-lg duration-200 rounded-br-lg rounded-tl-lg"
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateNews;
