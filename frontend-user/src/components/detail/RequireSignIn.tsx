import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { LogIn, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RequireSignIn({ open, setOpen, redirectLink }) {
  const navigate = useNavigate();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button
                    className="flex justify-center items-center space-x-2 w-full text-white rounded-xl hover:bg-primary/90 border-2 border-transparent transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/90 py-6"
                  >
                    <Ticket size={24} />
                    <p className="text-lg md:text-xl font-semibold">
                      Đặt chỗ ngay
                    </p>
                  </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col items-center justify-center">
          <DialogTitle>Yêu cầu đăng nhập</DialogTitle>
          <DialogDescription>
            Vui lòng đăng nhập để tiếp tục hành động này{" "}
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full gap-2 justify-between items-center">
          <DialogClose asChild className="w-1/2">
            <Button variant="outline" className="text-primary">
              Hủy
            </Button>
          </DialogClose>
          <Button
            className="w-1/2 flex items-center space-x-2"
            onClick={() => {
              navigate("/login", {
                state:{
                  redirectLink
                }
              });
              setOpen(false);
            }}
          >
            <LogIn />
            Đăng nhập
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RequireSignIn;
