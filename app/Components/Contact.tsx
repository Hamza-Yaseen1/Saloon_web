const Contact = () => {
  return (
    <div id="contact">
      <section className="flex flex-col md:flex-row">
        {/* Left Image */}
        <div className="w-full md:w-1/2">
          <img
            src="/images/Rectangle 30.png"
            alt="Contact section illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 bg-[#292D33] text-white flex flex-col justify-center items-center px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Contact Us
          </h1>

          <form className="w-full max-w-md space-y-5">
            <input
              type="text"
              placeholder="Enter Name"
              className="w-full p-3 rounded-lg border border-gray-500 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9D9570]"
            />
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full p-3 rounded-lg border border-gray-500 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9D9570]"
            />
            <textarea
              placeholder="Enter Message"
              rows={5}
              className="w-full p-3 rounded-lg border border-gray-500 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9D9570]"
            ></textarea>

            <button
              type="submit"
              className="w-full py-3 bg-[#9D9570] hover:bg-[#b0a56a] text-black font-semibold rounded-lg transition-colors duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
