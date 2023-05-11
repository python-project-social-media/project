import { Comment as CommentI } from "../../interfaces/Comment";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useContext } from "react";
import AuthContext from "../../context/context";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import tr from "javascript-time-ago/locale/tr";

function Comment(comment: {
  comment: CommentI | undefined;
  pid: number | undefined;
}) {
  let Comment: CommentI | undefined = comment?.comment;

  let { profile, deleteComment }: any = useContext(AuthContext);
  TimeAgo.addLocale(tr);
  return (
    <>
      {comment.comment != undefined ? (
        <div className="shadow-lg w-full bg-[#e9e9e9] rounded-md max-w-md p-3">
          <div className="p-0">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {Comment?.profile?.profilePhotoUrl ? (
                    <img
                      src={Comment?.profile?.profilePhotoUrl}
                      alt="PP"
                      className="rounded-full w-8 h-8 border border-[#C5C5C5]"
                    />
                  ) : (
                    <div className="rounded-full select-none w-8 h-8 border font-semibold text-sm bg-slate-300 border-[#C5C5C5] grid place-content-center">
                      {Comment?.profile?.user?.username
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  <p>{Comment?.profile?.user?.username}</p>
                  <p className="font-bold scale-110">•</p>
                  <ReactTimeAgo
                    date={Comment?.create || 0}
                    locale="tr-TR"
                    timeStyle={"mini-now"}
                  />
                </div>
                {profile && Comment?.profile_id == profile.id ? (
                  <RiDeleteBin6Fill
                    onClick={() => {
                      deleteComment(Comment?.id, comment.pid);
                    }}
                    className="cursor-pointer text-red-500 hover:text-red-700 duration-200"
                  />
                ) : null}
              </div>
              <p className="my-2">{Comment?.text}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="shadow-lg bg-[#e9e9e9] rounded-md max-w-md p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full w-8 h-8 border font-semibold text-sm grid place-content-center fade-bg"></div>
              <div className="w-28 h-3 rounded-lg fade-bg"></div>
            </div>
          </div>
          <p className="my-2 w-5/6 h-2 rounded-lg fade-bg"></p>
          <p className="my-2 w-5/6 h-2 rounded-lg fade-bg"></p>
          <p className="my-2 w-5/6 h-2 rounded-lg fade-bg"></p>
        </div>
      )}
    </>
  );
}

export default Comment;
