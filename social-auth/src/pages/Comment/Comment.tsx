import { Comment as CommentI } from "../../interfaces/Comment";
import { BsThreeDots } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { TfiCommentAlt } from "react-icons/tfi";
function Comment(comment: { comment: CommentI | undefined }) {
  let Comment = comment.comment;
  return (
    <>
      {comment != undefined ? (
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
                  <p>4g</p>
                </div>
                <BsThreeDots />
              </div>
              <p className="my-2">{Comment?.text}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="shadow-lg bg-[#F6F6F6] rounded-md max-w-md p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full w-8 h-8 border font-semibold text-sm grid place-content-center fade-bg"></div>
              <div className="w-28 h-3 rounded-lg fade-bg"></div>
            </div>
            <BsThreeDots />
          </div>
          <p className="my-2 w-5/6 h-2 rounded-lg fade-bg"></p>
          <p className="my-2 w-5/6 h-2 rounded-lg fade-bg"></p>
          <p className="my-2 w-5/6 h-2 rounded-lg fade-bg"></p>
          <div className="flex items-center justify-around">
            <div className="flex items-center gap-1">
              <TfiCommentAlt className="cursor-pointer" color="gray" />
              <p className="w-3 h-2 rounded-lg fade-bg"></p>
            </div>
            <div className="flex items-center gap-1">
              <AiFillHeart className="cursor-pointer" color="gray" size={19} />
              <p className="w-3 h-2 rounded-lg fade-bg"></p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Comment;
