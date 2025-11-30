import Header from "@/components/Header";
import landscapeSeaImg from "@/assets/landscape-sea.jpg";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/Footer";

function TermOfUse() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  const items = [
    {
      title: <h1 className="text-xl">Chấp nhận và phạm vi áp dụng</h1>,
      content: (
        <div className="text-base mx-2 text-black space-y-2">
          <p>
            Bằng việc truy cập, đăng ký, hoặc sử dụng bất kỳ dịch vụ nào do
            Venture cung cấp, bạn đồng ý tuân thủ các Điều khoản sử dụng này
            cũng như mọi quy định, hướng dẫn, chính sách bổ sung mà Venture có
            thể công bố. Điều khoản này áp dụng cho tất cả người dùng, bao gồm
            nhưng không giới hạn: khách truy cập website, người đăng ký tài
            khoản, khách hàng đặt tour, và các bên liên quan khác.
          </p>
          <p>
            Venture có quyền thay đổi, bổ sung hoặc điều chỉnh các Điều khoản sử
            dụng vào bất kỳ thời điểm nào mà không cần thông báo trước. Mọi thay
            đổi sẽ có hiệu lực kể từ thời điểm được công bố trên website hoặc
            ứng dụng của Venture. Việc bạn tiếp tục sử dụng dịch vụ sau khi có
            các cập nhật được coi là sự chấp thuận đối với các điều khoản đã sửa
            đổi. Trong trường hợp bạn không đồng ý với bất kỳ thay đổi nào, bạn
            cần ngừng sử dụng dịch vụ ngay lập tức.
          </p>
        </div>
      ),
    },
    {
      title: <h1 className="text-xl">Đăng ký và quản lý tài khoản</h1>,
      content: (
        <div className="text-base mx-2 text-black space-y-2">
          <p>
            Một số dịch vụ của Venture yêu cầu người dùng tạo tài khoản để truy
            cập và sử dụng. Khi đăng ký, bạn cam kết cung cấp thông tin chính
            xác, đầy đủ và cập nhật. Người dùng chịu trách nhiệm bảo mật thông
            tin đăng nhập, mật khẩu, và các dữ liệu cá nhân liên quan đến tài
            khoản.
          </p>
          <p>
            Bạn đồng ý thông báo ngay cho Venture khi phát hiện bất kỳ việc truy
            cập trái phép hoặc sử dụng tài khoản không hợp pháp. Venture có
            quyền tạm ngưng, hạn chế, hoặc xóa tài khoản nếu phát hiện vi phạm
            các Điều khoản, hành vi gian lận, hoặc hoạt động trái pháp luật.
            Venture không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ
            việc bạn không bảo mật thông tin đăng nhập hoặc cho phép người khác
            sử dụng tài khoản của mình.
          </p>
        </div>
      ),
    },
    {
      title: (
        <h1 className="text-xl">Đặt tour, thanh toán và chính sách hủy</h1>
      ),
      content: (
        <div className="text-base mx-2 text-black space-y-2">
          <p>
            Người dùng có thể đặt tour thông qua website hoặc ứng dụng của
            Venture theo các bước hướng dẫn. Việc đặt tour chỉ được xác nhận khi
            thanh toán đầy đủ và Venture gửi thông báo xác nhận. Venture cung
            cấp nhiều phương thức thanh toán hợp pháp, bao gồm thẻ tín dụng, thẻ
            ghi nợ, ví điện tử, hoặc các cổng thanh toán đối tác.
          </p>
          <p>
            Chính sách hủy, hoàn tiền, hoặc thay đổi lịch trình tour sẽ được quy
            định riêng cho từng loại tour và từng nhà cung cấp dịch vụ liên
            quan. Venture có quyền từ chối hoàn tiền hoặc áp dụng phí hủy theo
            điều kiện cụ thể. Người dùng chịu trách nhiệm đọc kỹ các chính sách
            trước khi đặt tour và thực hiện thanh toán. Venture không chịu trách
            nhiệm cho các chi phí phát sinh ngoài hợp đồng hoặc các dịch vụ bên
            thứ ba mà bạn lựa chọn tự ý sử dụng.
          </p>
        </div>
      ),
    },
    {
      title: <h1 className="text-xl">Quyền sở hữu trí tuệ</h1>,
      content: (
        <div className="text-base mx-2 text-black space-y-2">
          <p>
            Toàn bộ nội dung, hình ảnh, thiết kế, logo, biểu tượng, văn bản,
            phần mềm, cơ sở dữ liệu và tài liệu trên website, ứng dụng hoặc các
            nền tảng khác thuộc sở hữu của Venture hoặc được cấp phép hợp pháp.
            Người dùng không được sao chép, phát tán, chỉnh sửa, công bố, chuyển
            nhượng hoặc sử dụng bất kỳ tài sản trí tuệ nào của Venture cho mục
            đích thương mại hoặc phi thương mại mà không có sự đồng ý bằng văn
            bản của Venture. Mọi hành vi vi phạm quyền sở hữu trí tuệ có thể bị
            xử lý theo quy định pháp luật hiện hành, bao gồm bồi thường thiệt
            hại và các biện pháp khởi kiện hình sự hoặc dân sự.
          </p>
        </div>
      ),
    },
    {
      title: <h1 className="text-xl">Miễn trừ và giới hạn bồi thường</h1>,
      content: (
        <div className="text-base mx-2 text-black space-y-2">
          <p>
            Người dùng đồng ý rằng việc sử dụng dịch vụ của Venture hoàn toàn là
            trên cơ sở tự nguyện và chịu rủi ro cá nhân. Venture không chịu
            trách nhiệm về bất kỳ tổn thất, thiệt hại trực tiếp hoặc gián tiếp,
            chi phí phát sinh, mất mát dữ liệu, gián đoạn kinh doanh, hoặc các
            hậu quả phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.
          </p>
          <p>
            Người dùng đồng ý bồi thường và giữ Venture, các nhân viên, đối tác,
            nhà cung cấp và đại lý của Venture miễn trừ mọi trách nhiệm pháp lý,
            chi phí, yêu cầu, hoặc thiệt hại phát sinh từ:
          </p>
          <ul className="list-disc pl-6">
            <li>Việc vi phạm Điều khoản sử dụng</li>
            <li>
              Hành vi trái pháp luật, gian lận hoặc gây hại đến bên thứ ba
            </li>
            <li>
              Sử dụng dịch vụ không đúng mục đích hoặc trái với pháp luật.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: (
        <h1 className="text-xl">
          Trách nhiệm và giới hạn trách nhiệm của Venture
        </h1>
      ),
      content: (
        <div className="text-base mx-2 text-black space-y-2">
          <p>
            Venture cam kết cung cấp dịch vụ một cách minh bạch, hợp pháp và đảm
            bảo chất lượng ở mức tốt nhất có thể. Tuy nhiên, Venture không đảm
            bảo rằng dịch vụ sẽ luôn liên tục, không gián đoạn, không lỗi kỹ
            thuật, hoặc không có sự cố từ bên thứ ba.
          </p>
          <p>
            Trong phạm vi pháp luật cho phép, Venture không chịu trách nhiệm cho
            bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, đặc biệt hoặc
            phát sinh nào liên quan đến việc sử dụng hoặc không thể sử dụng dịch
            vụ, bao gồm nhưng không giới hạn: mất mát dữ liệu, gián đoạn kinh
            doanh, tổn thất lợi nhuận hoặc chi phí phát sinh từ việc sử dụng
            dịch vụ. Người dùng chịu trách nhiệm tự bảo vệ thông tin cá nhân, dữ
            liệu, và chuẩn bị các biện pháp dự phòng phù hợp.
          </p>
        </div>
      ),
    },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src={landscapeSeaImg}
          alt="Landscape Sea Background"
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/"></div>

        <div
          className={`container text-right relative z-10 transition-all duration-1000 ${
            isPageLoaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Điều khoản<span className="text-gradient"> sử dụng</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl ml-auto">
            Chúng tôi cam kết mang đến một môi trường trải nghiệm an toàn và
            công bằng. Việc bạn sử dụng dịch vụ đồng nghĩa với sự chấp thuận các
            quy định chung này.
          </p>
        </div>
      </section>
      <section className="mx-auto w-full py-5">
        <div
          className={`container flex flex-col justify-center transition-all duration-1000 delay-200 ${
            isPageLoaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            NỘI DUNG CÁC ĐIỀU KHOẢN
          </h2>
          <p className="italic mb-4">Lần cập nhật cuối: 10/07/2025</p>
          <p>
            <strong>Trang Điều khoản sử dụng </strong>là nơi Venture trình bày
            các quy định, quyền hạn, nghĩa vụ và trách nhiệm của cả người dùng
            và Venture khi truy cập và sử dụng dịch vụ. Nội dung của trang này
            giúp người dùng hiểu rõ cách đăng ký và quản lý tài khoản, cách đặt
            tour, thanh toán, chính sách hủy, cũng như quyền sở hữu trí tuệ và
            các giới hạn trách nhiệm pháp lý. Việc đọc và đồng ý với các điều
            khoản này giúp đảm bảo sự minh bạch, công bằng và an toàn cho cả hai
            bên, đồng thời tạo cơ sở pháp lý khi phát sinh tranh chấp hoặc vấn
            đề liên quan đến việc sử dụng dịch vụ. Trang này không chỉ là hướng
            dẫn pháp lý mà còn là cam kết của Venture về chất lượng và sự tin
            cậy trong quá trình cung cấp dịch vụ.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full py-5 mb-10">
        <div
          className={`container flex flex-col justify-center transition-all duration-1000 delay-200 ${
            isPageLoaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-2"
            defaultValue="item-1"
          >
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index + 1}`}
                className="bg-card rounded-md border-b-0 shadow-md data-[state=open]:shadow-lg"
              >
                <AccordionTrigger className="px-5 [&>svg]:rotate-90 [&[data-state=open]>svg]:rotate-0">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground px-5">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      <Footer/>
    </div>
  );
}

export default TermOfUse;
