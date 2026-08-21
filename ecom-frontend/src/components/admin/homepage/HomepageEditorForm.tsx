"use client";

import { useMemo, useState } from "react";
import { FiExternalLink, FiPlus, FiSave, FiTrash2, FiUpload } from "react-icons/fi";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Field, FormInput, FormSelect, FormTextarea } from "@/components/admin/ui/AdminForm";
import { BackendTheme, HomepagePosterItem, HomepageSettings, HomepageTestimonial, HomepageVideoItem, updateAdminHomepageSettings, updateAdminTheme } from "@/lib/api";

const fallbackTheme: BackendTheme = {
  themeName: "Modern Blue",
  primaryColor: "#111827",
  secondaryColor: "#047857",
  accentColor: "#F97316",
  backgroundColor: "#F7F7F2",
  surfaceColor: "#FFFFFF",
  textColor: "#111827",
  mutedColor: "#6B7280",
  borderColor: "#E5E7EB",
  headingFont: "Manrope",
  bodyFont: "Manrope",
  layoutStyle: "CLASSIC_ECOMMERCE",
};

type FormProps = {
  initialHomepage: HomepageSettings;
  initialTheme: BackendTheme | null;
};

export function HomepageEditorForm({ initialHomepage, initialTheme }: FormProps) {
  const [homepage, setHomepage] = useState(initialHomepage);
  const [theme, setTheme] = useState(initialTheme ?? fallbackTheme);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const previewStyle = useMemo(
    () => ({
      backgroundColor: theme.backgroundColor,
      color: theme.textColor,
      borderColor: theme.borderColor,
    }),
    [theme],
  );

  function updateHomepageField(field: keyof HomepageSettings, value: string) {
    setHomepage((current) => ({ ...current, [field]: value }));
  }

  function updateThemeField(field: keyof BackendTheme, value: string) {
    setTheme((current) => ({ ...current, [field]: value }));
  }

  function updateTestimonial(index: number, field: keyof HomepageTestimonial, value: string | number | null) {
    setHomepage((current) => ({
      ...current,
      testimonials: current.testimonials.map((testimonial, testimonialIndex) =>
        testimonialIndex === index ? { ...testimonial, [field]: value } : testimonial,
      ),
    }));
  }

  function updateVideo(index: number, field: keyof HomepageVideoItem, value: string) {
    setHomepage((current) => ({
      ...current,
      videoGalleryItems: current.videoGalleryItems.map((video, videoIndex) =>
        videoIndex === index ? { ...video, [field]: value } : video,
      ),
    }));
  }

  function addVideo() {
    setHomepage((current) => ({
      ...current,
      videoGalleryEnabled: true,
      videoGalleryItems: [...(current.videoGalleryItems ?? []), { title: "", embedUrl: "", posterUrl: "" }],
    }));
  }

  function removeVideo(index: number) {
    setHomepage((current) => ({
      ...current,
      videoGalleryItems: current.videoGalleryItems.filter((_, videoIndex) => videoIndex !== index),
    }));
  }

  function updatePoster(index: number, field: keyof HomepagePosterItem, value: string) {
    setHomepage((current) => ({
      ...current,
      posterGalleryItems: current.posterGalleryItems.map((poster, posterIndex) =>
        posterIndex === index ? { ...poster, [field]: value } : poster,
      ),
    }));
  }

  function addPoster() {
    setHomepage((current) => ({
      ...current,
      posterGalleryEnabled: true,
      posterGalleryItems: [...(current.posterGalleryItems ?? []), { title: "", imageUrl: "", linkUrl: "" }],
    }));
  }

  function removePoster(index: number) {
    setHomepage((current) => ({
      ...current,
      posterGalleryItems: current.posterGalleryItems.filter((_, posterIndex) => posterIndex !== index),
    }));
  }

  function addTestimonial() {
    setHomepage((current) => ({
      ...current,
      testimonials: [
        ...(current.testimonials ?? []),
        {
          name: "New customer",
          role: "",
          quote: "Write the customer review here.",
          rating: 5,
          image: "",
        },
      ],
    }));
  }

  function removeTestimonial(index: number) {
    setHomepage((current) => ({
      ...current,
      testimonials: current.testimonials.filter((_, testimonialIndex) => testimonialIndex !== index),
    }));
  }

  function uploadTestimonialImage(index: number, file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateTestimonial(index, "image", String(reader.result));
    reader.readAsDataURL(file);
  }

  async function save() {
    setStatus("saving");
    setErrorMessage("");
    try {
      const homepagePayload = {
        ...homepage,
        videoGalleryTitle: homepage.videoGalleryTitle?.trim() || null,
        videoGalleryDescription: homepage.videoGalleryDescription?.trim() || null,
        videoGalleryItems: (homepage.videoGalleryItems ?? [])
          .filter((video) => video.embedUrl.trim())
          .map((video) => ({
            title: video.title?.trim() || null,
            embedUrl: video.embedUrl.trim(),
            posterUrl: video.posterUrl?.trim() || null,
          })),
        posterGalleryTitle: homepage.posterGalleryTitle?.trim() || null,
        posterGalleryDescription: homepage.posterGalleryDescription?.trim() || null,
        posterGalleryItems: (homepage.posterGalleryItems ?? [])
          .filter((poster) => poster.imageUrl.trim())
          .map((poster) => ({
            title: poster.title?.trim() || null,
            imageUrl: poster.imageUrl.trim(),
            linkUrl: poster.linkUrl?.trim() || null,
          })),
        testimonials: homepage.testimonials
          .filter((testimonial) => testimonial.name.trim() && testimonial.quote.trim())
          .map((testimonial) => ({
            name: testimonial.name.trim(),
            role: testimonial.role?.trim() || null,
            quote: testimonial.quote.trim(),
            rating: Number(testimonial.rating ?? 5),
            image: testimonial.image?.trim() || null,
          })),
      };
      await Promise.all([
        updateAdminHomepageSettings(homepagePayload),
        updateAdminTheme({ ...fallbackTheme, ...theme, themeName: theme.themeName || "Modern Blue" }),
      ]);
      setHomepage(homepagePayload);
      setStatus("saved");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Save failed.");
      setStatus("error");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <div className="space-y-6">
        <Panel title="Hero section">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Eyebrow text"><FormInput value={homepage.heroEyebrow} onChange={(event) => updateHomepageField("heroEyebrow", event.target.value)} required /></Field>
            <Field label="Hero image URL"><FormInput value={homepage.heroImage} onChange={(event) => updateHomepageField("heroImage", event.target.value)} required /></Field>
          </div>
          <Field label="Headline"><FormTextarea value={homepage.heroTitle} onChange={(event) => updateHomepageField("heroTitle", event.target.value)} required /></Field>
          <Field label="Supporting text"><FormTextarea value={homepage.heroSubtitle} onChange={(event) => updateHomepageField("heroSubtitle", event.target.value)} required /></Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Primary button label"><FormInput value={homepage.primaryButtonLabel} onChange={(event) => updateHomepageField("primaryButtonLabel", event.target.value)} required /></Field>
            <Field label="Primary button link"><FormInput value={homepage.primaryButtonHref} onChange={(event) => updateHomepageField("primaryButtonHref", event.target.value)} required /></Field>
            <Field label="Secondary button label"><FormInput value={homepage.secondaryButtonLabel} onChange={(event) => updateHomepageField("secondaryButtonLabel", event.target.value)} required /></Field>
            <Field label="Secondary button link"><FormInput value={homepage.secondaryButtonHref} onChange={(event) => updateHomepageField("secondaryButtonHref", event.target.value)} required /></Field>
          </div>
        </Panel>

        <Panel title="Section copy">
          <SectionFields
            title="Categories"
            eyebrow={homepage.categoryEyebrow}
            heading={homepage.categoryTitle}
            description={homepage.categoryDescription}
            onEyebrow={(value) => updateHomepageField("categoryEyebrow", value)}
            onHeading={(value) => updateHomepageField("categoryTitle", value)}
            onDescription={(value) => updateHomepageField("categoryDescription", value)}
          />
          <SectionFields
            title="Featured products"
            eyebrow={homepage.featuredEyebrow}
            heading={homepage.featuredTitle}
            description={homepage.featuredDescription}
            onEyebrow={(value) => updateHomepageField("featuredEyebrow", value)}
            onHeading={(value) => updateHomepageField("featuredTitle", value)}
            onDescription={(value) => updateHomepageField("featuredDescription", value)}
          />
          <SectionFields
            title="Benefits"
            eyebrow={homepage.benefitsEyebrow}
            heading={homepage.benefitsTitle}
            description={homepage.benefitsDescription}
            onEyebrow={(value) => updateHomepageField("benefitsEyebrow", value)}
            onHeading={(value) => updateHomepageField("benefitsTitle", value)}
            onDescription={(value) => updateHomepageField("benefitsDescription", value)}
          />
          <SectionFields
            title="Best sellers"
            eyebrow={homepage.bestSellersEyebrow}
            heading={homepage.bestSellersTitle}
            description={homepage.bestSellersDescription}
            onEyebrow={(value) => updateHomepageField("bestSellersEyebrow", value)}
            onHeading={(value) => updateHomepageField("bestSellersTitle", value)}
            onDescription={(value) => updateHomepageField("bestSellersDescription", value)}
          />
        </Panel>

        <Panel title="Promotional banner">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Eyebrow"><FormInput value={homepage.promoEyebrow} onChange={(event) => updateHomepageField("promoEyebrow", event.target.value)} required /></Field>
            <Field label="Promo image URL"><FormInput value={homepage.promoImage ?? ""} onChange={(event) => updateHomepageField("promoImage", event.target.value)} /></Field>
          </div>
          <Field label="Promo title"><FormTextarea value={homepage.promoTitle} onChange={(event) => updateHomepageField("promoTitle", event.target.value)} required /></Field>
          <Field label="Promo description"><FormTextarea value={homepage.promoDescription} onChange={(event) => updateHomepageField("promoDescription", event.target.value)} required /></Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Button label"><FormInput value={homepage.promoButtonLabel} onChange={(event) => updateHomepageField("promoButtonLabel", event.target.value)} required /></Field>
            <Field label="Button link"><FormInput value={homepage.promoButtonHref} onChange={(event) => updateHomepageField("promoButtonHref", event.target.value)} required /></Field>
          </div>
        </Panel>

        <Panel title="Optional video gallery">
          <Toggle
            label="Show video gallery on landing page"
            checked={homepage.videoGalleryEnabled}
            onChange={(value) => setHomepage((current) => ({ ...current, videoGalleryEnabled: value }))}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Section title"><FormInput value={homepage.videoGalleryTitle ?? ""} onChange={(event) => updateHomepageField("videoGalleryTitle", event.target.value)} placeholder="Video Gallery" /></Field>
            <Field label="Section description"><FormInput value={homepage.videoGalleryDescription ?? ""} onChange={(event) => updateHomepageField("videoGalleryDescription", event.target.value)} /></Field>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-[#E2E8F0] pt-4">
            <p className="text-sm text-[#64748B]">Add YouTube watch links, youtu.be links, or direct embed URLs. The storefront shows up to four videos.</p>
            <AdminButton type="button" variant="secondary" onClick={addVideo}><FiPlus /> Add video</AdminButton>
          </div>
          <div className="space-y-4">
            {(homepage.videoGalleryItems ?? []).map((video, index) => (
              <article key={index} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="font-bold text-[#0F172A]">Video {index + 1}</h3>
                  <AdminButton type="button" variant="outline" onClick={() => removeVideo(index)} className="text-red-600 hover:border-red-200 hover:bg-red-50"><FiTrash2 /> Remove</AdminButton>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title"><FormInput value={video.title ?? ""} onChange={(event) => updateVideo(index, "title", event.target.value)} /></Field>
                  <Field label="Video URL"><FormInput value={video.embedUrl} onChange={(event) => updateVideo(index, "embedUrl", event.target.value)} placeholder="https://www.youtube.com/watch?v=..." required /></Field>
                  <Field label="Poster URL optional"><FormInput value={video.posterUrl ?? ""} onChange={(event) => updateVideo(index, "posterUrl", event.target.value)} placeholder="https://..." /></Field>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Optional poster gallery">
          <Toggle
            label="Show poster gallery on landing page"
            checked={homepage.posterGalleryEnabled}
            onChange={(value) => setHomepage((current) => ({ ...current, posterGalleryEnabled: value }))}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Section title"><FormInput value={homepage.posterGalleryTitle ?? ""} onChange={(event) => updateHomepageField("posterGalleryTitle", event.target.value)} placeholder="Poster Gallery" /></Field>
            <Field label="Section description"><FormInput value={homepage.posterGalleryDescription ?? ""} onChange={(event) => updateHomepageField("posterGalleryDescription", event.target.value)} /></Field>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-[#E2E8F0] pt-4">
            <p className="text-sm text-[#64748B]">Use campaign posters, offer artwork, brand images, or delivery banners. Links are optional.</p>
            <AdminButton type="button" variant="secondary" onClick={addPoster}><FiPlus /> Add poster</AdminButton>
          </div>
          <div className="space-y-4">
            {(homepage.posterGalleryItems ?? []).map((poster, index) => (
              <article key={index} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {poster.imageUrl ? <img src={poster.imageUrl} alt={poster.title || "Poster preview"} className="h-12 w-16 rounded-md object-cover" /> : null}
                    <h3 className="font-bold text-[#0F172A]">Poster {index + 1}</h3>
                  </div>
                  <AdminButton type="button" variant="outline" onClick={() => removePoster(index)} className="text-red-600 hover:border-red-200 hover:bg-red-50"><FiTrash2 /> Remove</AdminButton>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title"><FormInput value={poster.title ?? ""} onChange={(event) => updatePoster(index, "title", event.target.value)} /></Field>
                  <Field label="Image URL"><FormInput value={poster.imageUrl} onChange={(event) => updatePoster(index, "imageUrl", event.target.value)} placeholder="https://..." required /></Field>
                  <Field label="Link URL optional"><FormInput value={poster.linkUrl ?? ""} onChange={(event) => updatePoster(index, "linkUrl", event.target.value)} placeholder="/products or https://..." /></Field>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Testimonials">
          <SectionFields
            title="Section heading"
            eyebrow={homepage.testimonialsEyebrow}
            heading={homepage.testimonialsTitle}
            description={homepage.testimonialsDescription}
            onEyebrow={(value) => updateHomepageField("testimonialsEyebrow", value)}
            onHeading={(value) => updateHomepageField("testimonialsTitle", value)}
            onDescription={(value) => updateHomepageField("testimonialsDescription", value)}
          />
          <div className="flex items-center justify-between gap-3 border-t border-[#E2E8F0] pt-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-[#64748B]">Customer reviews</h3>
              <p className="mt-1 text-sm text-[#64748B]">Add as many testimonials as you need. The storefront switches to a carousel automatically.</p>
            </div>
            <AdminButton type="button" variant="secondary" onClick={addTestimonial}>
              <FiPlus /> Add testimonial
            </AdminButton>
          </div>
          <div className="space-y-4">
            {(homepage.testimonials ?? []).map((testimonial, index) => (
              <article key={index} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {testimonial.image ? (
                      <img src={testimonial.image} alt={testimonial.name || "Testimonial image"} className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-sm font-black text-[#0F172A] ring-1 ring-[#E2E8F0]">
                        {(testimonial.name || "C").slice(0, 1)}
                      </span>
                    )}
                    <div>
                      <h4 className="font-bold text-[#0F172A]">Testimonial {index + 1}</h4>
                      <p className="text-xs text-[#64748B]">Name, optional image, review text, and rating.</p>
                    </div>
                  </div>
                  <AdminButton type="button" variant="outline" onClick={() => removeTestimonial(index)} className="text-red-600 hover:border-red-200 hover:bg-red-50">
                    <FiTrash2 /> Remove
                  </AdminButton>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Customer name"><FormInput value={testimonial.name} onChange={(event) => updateTestimonial(index, "name", event.target.value)} required /></Field>
                  <Field label="Role or short label"><FormInput value={testimonial.role ?? ""} onChange={(event) => updateTestimonial(index, "role", event.target.value)} /></Field>
                  <Field label="Rating">
                    <FormSelect value={String(testimonial.rating ?? 5)} onChange={(event) => updateTestimonial(index, "rating", Number(event.target.value))} required>
                      <option value="5">5 stars</option>
                      <option value="4">4 stars</option>
                      <option value="3">3 stars</option>
                      <option value="2">2 stars</option>
                      <option value="1">1 star</option>
                    </FormSelect>
                  </Field>
                  <Field label="Image URL">
                    <FormInput value={testimonial.image ?? ""} onChange={(event) => updateTestimonial(index, "image", event.target.value)} placeholder="https://..." />
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="Review text"><FormTextarea value={testimonial.quote} onChange={(event) => updateTestimonial(index, "quote", event.target.value)} required /></Field>
                </div>
                <div className="mt-4">
                  <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#0F172A] transition hover:border-[#CBD5E1]">
                    <FiUpload /> Choose image
                    <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadTestimonialImage(index, event.target.files?.[0] ?? null)} />
                  </label>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Newsletter">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Eyebrow"><FormInput value={homepage.newsletterEyebrow} onChange={(event) => updateHomepageField("newsletterEyebrow", event.target.value)} required /></Field>
            <Field label="Button label"><FormInput value={homepage.newsletterButtonLabel} onChange={(event) => updateHomepageField("newsletterButtonLabel", event.target.value)} required /></Field>
          </div>
          <Field label="Title"><FormInput value={homepage.newsletterTitle} onChange={(event) => updateHomepageField("newsletterTitle", event.target.value)} required /></Field>
          <Field label="Description"><FormTextarea value={homepage.newsletterDescription} onChange={(event) => updateHomepageField("newsletterDescription", event.target.value)} required /></Field>
        </Panel>

        <Panel title="Button and theme colors">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Primary button color"><FormInput type="color" value={theme.primaryColor} onChange={(event) => updateThemeField("primaryColor", event.target.value)} /></Field>
            <Field label="Secondary button color"><FormInput type="color" value={theme.secondaryColor} onChange={(event) => updateThemeField("secondaryColor", event.target.value)} /></Field>
            <Field label="Accent color"><FormInput type="color" value={theme.accentColor} onChange={(event) => updateThemeField("accentColor", event.target.value)} /></Field>
            <Field label="Background color"><FormInput type="color" value={theme.backgroundColor} onChange={(event) => updateThemeField("backgroundColor", event.target.value)} /></Field>
            <Field label="Text color"><FormInput type="color" value={theme.textColor} onChange={(event) => updateThemeField("textColor", event.target.value)} /></Field>
            <Field label="Border color"><FormInput type="color" value={theme.borderColor} onChange={(event) => updateThemeField("borderColor", event.target.value)} /></Field>
          </div>
        </Panel>

        <div className="flex flex-wrap items-center gap-3">
          <AdminButton type="button" disabled={status === "saving"} onClick={save}>
            <FiSave /> {status === "saving" ? "Saving..." : "Save homepage"}
          </AdminButton>
          <a href="/" target="_blank" className="inline-flex h-10 items-center gap-2 rounded-md border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#0F172A]">
            <FiExternalLink /> View storefront
          </a>
          {status === "saved" ? <span className="text-sm font-semibold text-emerald-700">Saved.</span> : null}
          {status === "error" ? <span className="text-sm font-semibold text-red-600">{errorMessage}</span> : null}
        </div>
      </div>

      <aside className="space-y-6">
        <Panel title="Hero preview">
          <div className="overflow-hidden rounded-lg border" style={previewStyle}>
            <div className="relative min-h-80">
              <img src={homepage.heroImage} alt="Hero preview" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/55" />
              <div className="relative p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-wide text-white/70">{homepage.heroEyebrow}</p>
                <h2 className="mt-3 text-2xl font-black leading-tight">{homepage.heroTitle}</h2>
                <p className="mt-3 text-sm leading-6 text-white/75">{homepage.heroSubtitle}</p>
                <div className="mt-5 flex gap-2">
                  <span className="rounded-md px-3 py-2 text-xs font-bold text-white" style={{ backgroundColor: theme.secondaryColor }}>{homepage.primaryButtonLabel}</span>
                  <span className="rounded-md border border-white/30 px-3 py-2 text-xs font-bold text-white">{homepage.secondaryButtonLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </Panel>
        <Panel title="Color preview">
          <div className="rounded-lg border p-4" style={previewStyle}>
            <div className="rounded-md p-4" style={{ backgroundColor: theme.surfaceColor }}>
              <h3 className="font-black">Product card button</h3>
              <p className="mt-1 text-sm" style={{ color: theme.mutedColor }}>This uses the saved storefront theme.</p>
              <span className="mt-4 inline-flex rounded-md px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: theme.primaryColor }}>Add to cart</span>
            </div>
          </div>
        </Panel>
      </aside>
    </div>
  );
}

function SectionFields({
  title,
  eyebrow,
  heading,
  description,
  onEyebrow,
  onHeading,
  onDescription,
}: {
  title: string;
  eyebrow: string;
  heading: string;
  description: string;
  onEyebrow: (value: string) => void;
  onHeading: (value: string) => void;
  onDescription: (value: string) => void;
}) {
  return (
    <div className="border-t border-[#E2E8F0] pt-4 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-[#64748B]">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Eyebrow"><FormInput value={eyebrow} onChange={(event) => onEyebrow(event.target.value)} required /></Field>
        <Field label="Title"><FormInput value={heading} onChange={(event) => onHeading(event.target.value)} required /></Field>
      </div>
      <div className="mt-4">
        <Field label="Description"><FormTextarea value={description} onChange={(event) => onDescription(event.target.value)} required /></Field>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-semibold text-[#0F172A]">
      <span>{label}</span>
      <span className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-[#2563EB]" : "bg-[#CBD5E1]"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${checked ? "left-5" : "left-0.5"}`} />
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="sr-only" />
    </label>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-4 rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm"><h2 className="text-lg font-bold">{title}</h2>{children}</section>;
}
