import AccountSection from "@/components/AccountSection";
import CalendarSection from "@/components/CalendarSection";
import ContactSection from "@/components/ContactSection";
import FadeInSection from "@/components/FadeInSection";
import GallerySection from "@/components/GallerySection";
import GuestbookSection from "@/components/GuestbookSection";
import IntroSection from "@/components/IntroSection";
import InvitationSection from "@/components/InvitationSection";
import LocationSection from "@/components/LocationSection";
import ScheduleSection from "@/components/ScheduleSection";
import ShareSection from "@/components/ShareSection";

const sections = [
  { key: "invitation", Component: InvitationSection },
  { key: "schedule", Component: ScheduleSection },
  { key: "calendar", Component: CalendarSection },
  { key: "gallery", Component: GallerySection },
  { key: "location", Component: LocationSection },
  { key: "contact", Component: ContactSection },
  { key: "account", Component: AccountSection },
  { key: "guestbook", Component: GuestbookSection },
  { key: "share", Component: ShareSection }
];

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[30rem] px-4 py-5 sm:px-5">
      <IntroSection />
      <div className="mt-5 space-y-5">
        {sections.map(({ key, Component }, index) => (
          <FadeInSection key={key} className="will-change-transform">
            <Component />
            {index === sections.length - 1 ? (
              <p className="py-7 text-center font-serif text-sm text-ink/50">
                Thank you for celebrating with us.
              </p>
            ) : null}
          </FadeInSection>
        ))}
      </div>
    </main>
  );
}
