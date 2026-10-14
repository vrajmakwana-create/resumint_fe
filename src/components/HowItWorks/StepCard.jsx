export default function StepCard({ number, title, description, footerBadge }) {
  return (
    <div className="bg-white rounded-xl p-8 border border-[#DCE5F0] custom-shadow-ambient relative flex flex-col items-start">
      <div className="w-10 h-10 rounded-lg bg-primary-container text-white font-headline-card font-bold flex items-center justify-center mb-6 shadow-sm">
        {number}
      </div>
      <h3 className="font-headline-card text-headline-card text-[#14243B] font-semibold mb-2">
        {title}
      </h3>
      <p className="font-body-default text-body-default text-[#64748B] leading-relaxed">
        {description}
      </p>
      <div className="mt-6 inline-flex items-center text-caption-helper font-medium text-primary-container gap-1">
        <span>{footerBadge}</span>
      </div>
    </div>
  )
}
