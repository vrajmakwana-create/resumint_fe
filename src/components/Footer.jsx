export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant">
      <div className="w-full px-space-lg md:px-margin max-w-[1440px] mx-auto py-space-2xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Identity Column */}
          <div className="col-span-2">
            <a
              className="text-headline-section font-headline-section font-bold text-on-surface flex items-center gap-space-xs text-[#102544] mb-3"
              href="#"
            >
              <div className="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center text-white">
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  description
                </span>
              </div>
              <span>Resumint</span>
            </a>
            <p className="text-on-surface-variant text-body-default font-body-default max-w-sm text-[#64748B]">
              Automated resume optimization and semantic job-matching intelligence built for modern careers.
            </p>
          </div>

          {/* Links Column 1: Product */}
          <div>
            <h4 className="font-body-semibold text-body-semibold text-[#102544] mb-3">Product</h4>
            <ul className="space-y-2 text-on-surface-variant text-body-default font-body-default text-[#64748B]">
              <li>
                <a className="hover:text-primary transition-colors duration-150" href="#">
                  Resume Builder
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors duration-150" href="#">
                  Job Match Scanner
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors duration-150" href="#">
                  ATS Checker
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors duration-150" href="#">
                  Resume Templates
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Resources */}
          <div>
            <h4 className="font-body-semibold text-body-semibold text-[#102544] mb-3">Resources</h4>
            <ul className="space-y-2 text-on-surface-variant text-body-default font-body-default text-[#64748B]">
              <li>
                <a className="hover:text-primary transition-colors duration-150" href="#">
                  Career Guides
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors duration-150" href="#">
                  Resume Examples
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors duration-150" href="#">
                  ATS Benchmarks
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors duration-150" href="#">
                  Action Verb List
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Legal & Contact */}
          <div>
            <h4 className="font-body-semibold text-body-semibold text-[#102544] mb-3">Legal</h4>
            <ul className="space-y-2 text-on-surface-variant text-body-default font-body-default text-[#64748B]">
              <li>
                <a className="hover:text-primary transition-colors duration-150" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors duration-150" href="#">
                  Terms of Service
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors duration-150" href="#">
                  Security
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors duration-150" href="#">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-[#DCE5F0] flex flex-col sm:flex-row justify-between items-center gap-4 text-caption-helper font-caption-helper text-[#64748B]">
          <div>© 2024 Resumint AI Inc. All rights reserved.</div>
          <div className="flex items-center space-x-6">
            <a className="hover:text-primary transition-colors duration-150" href="#">
              Privacy
            </a>
            <a className="hover:text-primary transition-colors duration-150" href="#">
              Terms
            </a>
            <a className="hover:text-primary transition-colors duration-150" href="#">
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
