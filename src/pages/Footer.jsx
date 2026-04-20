const Footer = () => {
  return (
    <footer className="w-full py-12 px-6 bg-gradient-to-b from-[#1a1a1a] via-[#0f0f0f] to-black border-t-8 border-[#cf5deb]/50">
      <div className="max-w-6xl mx-auto">
        {/* Top section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <img 
              src="https://res.cloudinary.com/danxmqgxb/image/upload/v1776712193/Gemini_Generated_Image_ykj5rqykj5rqykj5_gbf1ux.png"
              alt="Logo" 
              className="w-24 h-24 mx-auto rounded-3xl shadow-2xl border-4 border-[#cf5deb]/50 bg-gradient-to-br from-white/10 p-3"
            />
          </div>
          <h3 className="text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-[#cf5deb] to-[#D4AF37] bg-clip-text text-transparent mb-4 tracking-tight">
            Sandesha Candle Studio
          </h3>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Crafting luxury for your home
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12 text-center">
          <div className="flex flex-wrap gap-6 justify-center">
            <a href="#" className="group relative px-8 py-4 text-white font-semibold text-lg bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:border-[#cf5deb]/50 hover:bg-white/20 hover:text-[#cf5deb] transition-all duration-500 shadow-2xl hover:shadow-3xl hover:-translate-y-2 hover:scale-[1.02]">
              <span className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#cf5deb]/0 via-[#cf5deb]/20 to-[#cf5deb]/0 -translate-x-2 group-hover:translate-x-2 transition-transform duration-700 opacity-0 group-hover:opacity-100"></span>
              About
            </a>
            <a href="#" className="group relative px-8 py-4 text-white font-semibold text-lg bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:border-[#cf5deb]/50 hover:bg-white/20 hover:text-[#cf5deb] transition-all duration-500 shadow-2xl hover:shadow-3xl hover:-translate-y-2 hover:scale-[1.02]">
              <span className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#cf5deb]/0 via-[#cf5deb]/20 to-[#cf5deb]/0 -translate-x-2 group-hover:translate-x-2 transition-transform duration-700 opacity-0 group-hover:opacity-100"></span>
              Privacy
            </a>
            <a href="https://www.instagram.com/sandeshacandle.studio?igsh=MXQ4MmQzazU4cjN2ZA==" target="_blank" rel="noopener noreferrer" className="group relative px-8 py-4 text-white font-semibold text-lg bg-gradient-to-r from-pink-600/80 to-purple-600/80 backdrop-blur-sm rounded-3xl border border-white/30 hover:border-pink-400/60 hover:scale-[1.05] transition-all duration-500 shadow-2xl hover:shadow-[0_20px_40px_rgba(236,72,153,0.4)] hover:-translate-y-3">
              <span className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-400/30 via-purple-400/30 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-y-1 group-hover:translate-y-0"></span>
              📱 Instagram
            </a>
            <a href="#" className="group relative px-8 py-4 text-white font-semibold text-lg bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:border-[#cf5deb]/50 hover:bg-white/20 hover:text-[#cf5deb] transition-all duration-500 shadow-2xl hover:shadow-3xl hover:-translate-y-2 hover:scale-[1.02]">
              <span className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#cf5deb]/0 via-[#cf5deb]/20 to-[#cf5deb]/0 -translate-x-2 group-hover:translate-x-2 transition-transform duration-700 opacity-0 group-hover:opacity-100"></span>
              Contact
            </a>
          </div>
        </div>

        {/* Designer credit */}
        <div className="text-center pt-12 border-t-2 border-white/20">
          <div className="inline-flex items-center px-12 py-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:border-[#cf5deb]/60 hover:bg-white/20 hover:text-[#cf5deb] transition-all duration-500 shadow-2xl hover:shadow-3xl hover:-translate-y-1">
            <span className="text-lg font-bold bg-gradient-to-r from-[#cf5deb] to-[#D4AF37] bg-clip-text text-transparent tracking-wide drop-shadow-lg">
              Designed by Hassan bin Nisar
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

