import AccountSection from "@/components/AccountSection";
import ContactSection from "@/components/ContactSection";
import EndingSection from "@/components/EndingSection";
import FadeInSection from "@/components/FadeInSection";
import GallerySection from "@/components/GallerySection";
import GuestPhotoSection from "@/components/GuestPhotoSection";
import GuestbookSection from "@/components/GuestbookSection";
import IntroSection from "@/components/IntroSection";
import InvitationSection from "@/components/InvitationSection";
import LocationSection from "@/components/LocationSection";
import ScheduleSection from "@/components/ScheduleSection";
import ShareSection from "@/components/ShareSection";

const sections = [
  { key: "invitation", Component: InvitationSection },
  { key: "schedule", Component: ScheduleSection },
  { key: "location", Component: LocationSection },
  { key: "gallery", Component: GallerySection },
  { key: "guest-photos", Component: GuestPhotoSection },
  { key: "contact", Component: ContactSection },
  { key: "account", Component: AccountSection },
  { key: "guestbook", Component: GuestbookSection },
  { key: "share", Component: ShareSection },
  { key: "ending", Component: EndingSection }
];

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[30rem] px-4 py-5 sm:px-5">
      <IntroSection />
      <div className="mt-5 space-y-5">
        {sections.map(({ key, Component }) => (
          <FadeInSection key={key} className="will-change-transform">
            <Component />
          </FadeInSection>
        ))}
      </div>
    </main>
  );
}
