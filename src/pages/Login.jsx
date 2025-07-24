export default function Login() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#14191f] relative overflow-hidden">
      {/* 배경 원형/도형 */}
      <div className="absolute left-0 top-0 w-[1440px] h-[1024px] pointer-events-none select-none">
        {/* Ellipse 1 */}
        <div className="absolute left-[65%] top-[20%] w-[494px] h-[494px] rounded-full bg-[#fc4ff6] opacity-40 blur-2xl" />
        {/* Ellipse 3 */}
        <div className="absolute left-[0%] top-[22%] w-[494px] h-[494px] rounded-full bg-[#899aff] opacity-30 blur-2xl" />
        {/* Ellipse 6 */}
        <div className="absolute left-[35%] top-0 w-[426px] h-[426px] rounded-full bg-[#485dff] opacity-30 blur-2xl" />
      </div>

      {/* 로그인 카드 */}
      <div className="relative z-10 flex flex-col items-center bg-gradient-to-b from-[#000000] to-[#371866] border-2 border-[#a11bf4] rounded-xl shadow-xl p-10 w-[420px] max-w-full">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#ff1cf7] to-[#00f0ff] bg-clip-text text-transparent mb-8 tracking-wider">Welcome!</h1>
        <form className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-white text-sm mb-1 ml-2">사원번호</label>
            <input type="text" className="w-full rounded-full border border-[#8125e5] bg-transparent px-5 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8125e5]" placeholder="사원번호를 입력하세요" />
          </div>
          <div>
            <label className="block text-white text-sm mb-1 ml-2">비밀번호</label>
            <input type="password" className="w-full rounded-full border border-[#8125e5] bg-transparent px-5 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8125e5]" placeholder="비밀번호를 입력하세요" />
          </div>
          <button type="submit" className="mt-4 w-full rounded-lg bg-gradient-to-r from-[#d1d3e2] to-[#75629d] text-black font-bold py-3 text-lg hover:from-[#75629d] hover:to-[#d1d3e2] transition">Login</button>
        </form>
        <p className="mt-6 text-[#fff27a] text-xs text-center">로그인에 문제가 있는 경우 관리자에게 문의하십시오.</p>
      </div>
    </div>
  );
}