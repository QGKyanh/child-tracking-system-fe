import React from 'react';

function AboutUs() {
    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg p-8 mt-10 rounded-xl">
            <h1 className="text-center text-lg font-bold mb-4">LỜI GIỚI THIỆU VỀ CHƯƠNG TRÌNH</h1>

            <div className="flex justify-center space-x-4 mb-6">
                <button className="text-red-500 hover:text-red-700 transition-colors rounded-full p-2" aria-label="Thích">
                    <i className="fas fa-heart"></i>
                </button>
                <button className="text-gray-500 hover:text-blue-600 transition-colors rounded-full p-2" aria-label="Chia sẻ Facebook">
                    <i className="fab fa-facebook-f"></i>
                </button>
                <button className="text-gray-500 hover:text-blue-400 transition-colors rounded-full p-2" aria-label="Chia sẻ Twitter">
                    <i className="fab fa-twitter"></i>
                </button>
                <button className="text-gray-500 hover:text-pink-600 transition-colors rounded-full p-2" aria-label="Chia sẻ Instagram">
                    <i className="fab fa-instagram"></i>
                </button>
                <button className="text-gray-500 hover:text-blue-800 transition-colors rounded-full p-2" aria-label="Chia sẻ LinkedIn">
                    <i className="fab fa-linkedin-in"></i>
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition-colors rounded-full p-2" aria-label="Gửi email">
                    <i className="fas fa-envelope"></i>
                </button>
            </div>

            <h2 className="text-center text-3xl text-green-600 font-bold mb-6">LỜI GIỚI THIỆU</h2>

            <p className="text-justify mb-4">
                Trong khuôn khổ các sự kiện diễn ra trong năm 2011 - 2020 và nhằm mục tiêu nâng cao nhận thức của cộng đồng về các vấn đề liên quan đến sức khỏe, chúng tôi xin giới thiệu chương trình này.
            </p>

            <p className="text-justify mb-4">
                Chương trình này sẽ bao gồm các hoạt động nhằm nâng cao nhận thức và cung cấp thông tin về các vấn đề sức khỏe quan trọng. Chúng tôi hy vọng rằng thông qua chương trình này, mọi người sẽ có thêm kiến thức và hiểu biết để chăm sóc sức khỏe của mình và gia đình.
            </p>

            <blockquote className="border-l-4 border-red-600 pl-4 italic text-red-600 mb-4 rounded-r-lg bg-red-50 p-4">
                <p>
                    "Mục tiêu của Chương trình là đóng góp vào việc cải thiện sức khỏe của cộng đồng thông qua việc cung cấp thông tin, giáo dục và hỗ trợ các hoạt động liên quan đến sức khỏe. Chúng tôi tin rằng với sự tham gia và ủng hộ của các bạn, chúng ta sẽ đạt được những kết quả tốt đẹp."
                </p>
            </blockquote>

            <div className="bg-yellow-100 p-4 mb-4 rounded-lg">
                <p className="text-justify">
                    Các hoạt động của chương trình sẽ được tổ chức với sự hợp tác của các tổ chức và cá nhân có uy tín trong lĩnh vực y tế và sức khỏe. Chúng tôi cam kết sẽ nỗ lực hết mình để mang lại những thông tin và dịch vụ tốt nhất cho cộng đồng.
                </p>
            </div>

            <p className="text-justify mb-4">
                Các đơn vị tham gia tổ chức và thực hiện chương trình bao gồm:
            </p>

            <ul className="list-disc list-inside mb-4">
                <li className="mb-2">
                    <span className="font-bold">Hội Y học Việt Nam</span>: Hội Y học Việt Nam là một trong những đơn vị hàng đầu trong lĩnh vực y tế và sức khỏe tại Việt Nam.
                </li>
                <li className="mb-2">
                    <span className="font-bold">Viện Dinh dưỡng Quốc gia</span>: Viện Dinh dưỡng Quốc gia là đơn vị nghiên cứu và cung cấp thông tin về dinh dưỡng và sức khỏe.
                </li>
                <li className="mb-2">
                    <span className="font-bold">Công ty Alimexco Việt Nam</span>: Công ty Alimexco Việt Nam là một trong những đơn vị hàng đầu trong lĩnh vực cung cấp các sản phẩm và dịch vụ y tế.
                </li>
            </ul>

            <p className="text-justify mb-4">
                Chương trình sẽ bao gồm các hoạt động như hội thảo, tọa đàm, triển lãm và các hoạt động giáo dục cộng đồng. Chúng tôi hy vọng rằng thông qua các hoạt động này, mọi người sẽ có thêm kiến thức và hiểu biết để chăm sóc sức khỏe của mình và gia đình.
            </p>

            <p className="text-justify mb-4">
                Chúng tôi xin cảm ơn các đơn vị và cá nhân đã tham gia và ủng hộ chương trình này. Chúng tôi hy vọng rằng với sự tham gia và ủng hộ của các bạn, chúng ta sẽ đạt được những kết quả tốt đẹp.
            </p>

            <div className="bg-green-100 p-4 text-center rounded-lg">
                <a
                    href="#"
                    className="text-green-600 font-bold hover:text-green-800 transition-colors rounded-md px-4 py-2 inline-block"
                    onClick={(e) => e.preventDefault()}
                >
                    Xem Thêm Về Chương Trình
                </a>
            </div>
        </div>
    );
}

export default AboutUs;