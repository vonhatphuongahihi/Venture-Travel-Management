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

function PrivacyPolicy() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  const items = [
    {
      title: <h1 className="text-xl">1. Thông tin được thu thập và xử lý</h1>,
      content: (
        <div className="text-base mx-2 text-black space-y-2">
          Thông tin được xử lý có thể bao gồm:
          <ul className="list-disc pl-6">
            <li>
              Thông tin liên hệ, bao gồm tên, số điện thoại, mã bưu điện và
              email
            </li>
            <li>Thông tin thanh toán và thông tin thanh toán khác</li>
            <li>Tài liệu hỗ trợ du lịch và lập kế hoạch</li>
            <li>Tên người dùng và mật khẩu</li>
            <li>Thông tin liên quan đến tư cách thành viên Venture của bạn</li>
            <li>
              Ảnh, đánh giá, bài đăng trên diễn đàn và mạng xã hội, và video bạn
              có thể đã cung cấp cho chúng tôi
            </li>
            <li>Thông tin định vị địa lý</li>
            <li>Thông tin thiết bị</li>
            <li>
              Hoạt động trực tuyến, bao gồm các trang bạn đã truy cập, nội dung
              đã xem xét và ứng dụng đã xem xét
            </li>
            <li>Thông tin khác về bản thân mà bạn đã tự nguyện tiết lộ</li>
            <li>Lịch sử mua hàng và đặt chỗ</li>
            <li>
              Thông tin về du lịch, trải nghiệm, kế hoạch và sở thích ăn uống
              của bạn
            </li>
            <li>
              Thông tin liên lạc khi bạn liên hệ với nhóm dịch vụ khách hàng của
              chúng tôi, bao gồm các cuộc gọi đến và đi
            </li>
            <li>
              Thông tin bạn đã cung cấp cho các công ty bên thứ ba khác cho mục
              đích đăng nhập lên mạng xã hội. Điều này bao gồm thông tin công
              khai, chẳng hạn như tên, độ tuổi cũng như địa chỉ email.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: <h1 className="text-xl">2. Sử dụng và mục đích thông tin</h1>,
      content: (
        <div className="text-base mx-2 text-black space-y-2">
          Chúng tôi sử dụng thông tin của bạn để cung cấp nội dung phù hợp và
          trải nghiệm cá nhân hóa, bao gồm:
          <ul className="list-disc pl-6">
            <li>
              Tài khoản & Giao dịch: Đăng ký và quản lý tài khoản, xử lý đặt chỗ
              và thanh toán, cung cấp các chương trình khuyến mãi.
            </li>
            <li>
              Cải thiện Dịch vụ: Phân tích dữ liệu để nâng cao dịch vụ và mời
              bạn tham gia khảo sát hoặc nghiên cứu.
            </li>
            <li>
              Cá nhân hóa: Đề xuất ưu đãi, điều chỉnh nội dung và quảng cáo dựa
              trên sở thích của bạn.
            </li>
            <li>
              Giao tiếp: Liên hệ với bạn hoặc hỗ trợ liên hệ với đối tác, ghi
              lại tương tác, đăng nội dung của bạn và phản hồi thắc mắc.
            </li>
            <li>
              Tuân thủ pháp luật: Giải quyết tranh chấp, ngăn chặn gian lận,
              tuân thủ quy định và bảo vệ quyền lợi.
            </li>
          </ul>
          <p>
            Nếu chúng tôi sử dụng quyết định tự động, sẽ có biện pháp bảo vệ và
            đảm bảo quyền được can thiệp bởi con người.
          </p>
        </div>
      ),
    },
    {
      title: <h1 className="text-xl">3. Chia sẻ và xử lý thông tin</h1>,
      content: (
        <div className="text-base mx-2 text-black space-y-2">
          <p>
            Chúng tôi có thể chia sẻ thông tin của bạn với các công ty cùng tập
            đoàn, nhà cung cấp dịch vụ, đối tác kinh doanh, mạng xã hội, mạng
            quảng cáo, bên thứ ba đáng tin cậy hoặc cơ quan pháp luật để cung
            cấp dịch vụ, xử lý thanh toán, cá nhân hóa trải nghiệm, ngăn chặn
            gian lận, tuân thủ quy định và bảo vệ quyền lợi.
          </p>
          <p>
            Thông tin có thể được chuyển ra nước ngoài, lưu trữ trong thời gian
            cần thiết, và được bảo vệ bằng các biện pháp kỹ thuật, quản trị và
            vật lý (như mã hóa, tường lửa).
          </p>
          <p>
            Bạn có thể điều chỉnh quyền riêng tư hoặc yêu cầu xóa tài khoản
            trong phần <b>"Hồ sơ"</b>.
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
            Chính Sách <span className="text-gradient">Bảo mật</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl ml-auto">
            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn, đảm bảo mọi dữ
            liệu được xử lý một cách an toàn, minh bạch và tôn trọng quyền riêng
            tư của bạn trong suốt quá trình trải nghiệm dịch vụ.
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
            TUYÊN BỐ VỀ QUYỀN RIÊNG TƯ VÀ COOKIE
          </h2>
          <p className="italic mb-4">Lần cập nhật cuối: 07/07/2025</p>
          <p>
            <strong>Venture</strong> sở hữu và vận hành một nền tảng trực tuyến
            cung cấp cho người dùng thông tin, khuyến nghị và dịch vụ liên quan
            đến du lịch và giải trí, bao gồm các công cụ nghiên cứu và/hoặc đặt
            phòng khách sạn, nhà nghỉ cho thuê và các chỗ ở khác, điểm tham quan
            và trải nghiệm, nhà hàng, chuyến bay và du thuyền, cùng các dịch vụ
            giải trí khác. Trong Tuyên bố này, chúng tôi gọi những dịch vụ này
            là "Dịch vụ" của chúng tôi. Thông tin mà bạn và những người khác
            giao phó cho chúng tôi giúp chúng tôi nâng cao khả năng cung cấp các
            Dịch vụ phù hợp, được cá nhân hóa và hữu ích hơn. Chúng tôi hiểu
            rằng việc chia sẻ thông tin của bạn với chúng tôi dựa trên sự tin
            tưởng. Chúng tôi rất coi trọng sự tin tưởng của bạn và cam kết cung
            cấp cho bạn thông tin, sản phẩm và dịch vụ hữu ích, được tuyển chọn
            dựa trên thông tin bạn đã chia sẻ với chúng tôi. Tương tự, và có lẽ
            quan trọng hơn, chúng tôi cam kết tôn trọng quyền riêng tư của bạn
            khi bạn truy cập trang web hoặc sử dụng Dịch vụ của chúng tôi và
            minh bạch về cách chúng tôi sử dụng thông tin bạn đã giao phó cho
            chúng tôi. Tuyên bố này mô tả cách chúng tôi thu thập, sử dụng và xử
            lý thông tin của bạn. Tuyên bố này cung cấp cho bạn thông tin về các
            quyền của bạn, cách bạn có thể thực hiện các quyền đó và cách bạn có
            thể liên hệ với chúng tôi. Vui lòng xem xét kỹ Tuyên bố này để tìm
            hiểu về các hoạt động của chúng tôi liên quan đến thông tin và quyền
            riêng tư. Bằng cách truy cập trang web và các ứng dụng di động liên
            quan của chúng tôi, cũng như các nền tảng trực tuyến khác như trang
            web, ứng dụng và mạng xã hội của các đối tác liên kết, dù là trên
            máy tính, điện thoại, máy tính bảng hay thiết bị tương tự (mỗi thiết
            bị này được gọi là "Thiết bị"), bạn thừa nhận và xác nhận rằng bạn
            đã đọc Tuyên bố này.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full py-5 mb-10">
        <div className="container flex flex-col justify-center">
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

export default PrivacyPolicy;
