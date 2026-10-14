export default function FeatureCard({ icon, title, description, footerText, footerIcon }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#DCE5F0] custom-shadow-ambient hover:custom-shadow-elevated transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="w-12 h-12 rounded-lg bg-[#EFF6FF] text-primary-container flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200">
          <span className="material-symbols-outlined text-[26px]">{icon}</span>
        </div>
        <h3 className="font-headline-card text-headline-card text-[#14243B] font-semibold mb-2">
          {title}
        </h3>
        <p className="font-body-default text-body-default text-[#64748B] leading-relaxed">
          {description}
        </p>
      </div>
      <div className="mt-6 pt-4 border-t border-[#DCE5F0] flex items-center text-primary-container font-body-semibold text-body-semibold text-sm">
        <span>{footerText}</span>
        <span className="material-symbols-outlined text-[16px] ml-1">{footerIcon}</span>
      </div>
    </div>
  )
}
