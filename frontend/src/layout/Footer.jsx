function Footer({collapsed}) {
  return (
      <footer
          className={`
                fixed
                bottom-0
                right-0
                z-40
                h-12
                bg-gray-800
                shadow
                transition-all duration-300
                flex items-center justify-center
                ${collapsed ? "left-20" : "left-72"}
            `}
      >

        <p className="text-sm text-white">
          © 2026 Government Boys Elementary School Gharibabad Sukkur
        </p>
    </footer>
  );
}

export default Footer;
