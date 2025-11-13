import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

function PoilcyModal({ cancelPolicy }: { cancelPolicy: string }) {
  const policy = cancelPolicy.split("\n").filter((line) => line.trim() !== "");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-sm font-bold underline cursor-pointer">
          Chính sách hủy
        </span>
      </DialogTrigger>
      <DialogContent aria-description={undefined}>
        <DialogTitle>Chính sách hủy</DialogTitle>
        <div>
          <ul>
            {policy.map((item, index) => (
              <li key={index} className="mb-2 list-disc list-inside">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PoilcyModal;
