import AccountSection from "@/components/AccountSection";
import CardHearts from "@/components/CardHearts";
import ContactSection from "@/components/ContactSection";
import EndingSection from "@/components/EndingSection";
import FadeInSection from "@/components/FadeInSection";
import GallerySection from "@/components/GallerySection";
import GuestPhotoSection from "@/components/GuestPhotoSection";
import GuestbookSection from "@/components/GuestbookSection";
import IntroSection from "@/components/IntroSection";
import LocationSection from "@/components/LocationSection";
import OpeningIntro from "@/components/OpeningIntro";
import ScheduleSection from "@/components/ScheduleSection";

const sections = [
  { key: "schedule", Component: ScheduleSection },
  { key: "gallery", Component: GallerySection },
  { key: "contact", Component: ContactSection },
  { key: "account", Component: AccountSection },
  { key: "guestbook", Component: GuestbookSection },
  { key: "guest-photos", Component: GuestPhotoSection },
  { key: "location", Component: LocationSection },
  { key: "ending", Component: EndingSection }
];

export default function Home() {
  return (
    <>
      <OpeningIntro />
      <main
        data-heart-card
        className="relative isolate mx-auto min-h-screen w-full max-w-[30rem] px-4 py-5 sm:px-5"
      >
        <CardHearts />
        <div className="relative z-10">
          <IntroSection />
          <div className="mt-5 space-y-5">
            {sections.map(({ key, Component }) => (
              <FadeInSection key={key} className="will-change-transform">
                <Component />
              </FadeInSection>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
