import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="flex">
      {/* 왼쪽에 고정된 Navbar */}
      <Navbar />

      {/* 오른쪽에 메인 콘텐츠 */}
      <div className="p-4 flex-1">
        메인 홈 화면 입니다..
      </div>
    </div>
  );
}