"use client";

import { BaseForm } from "@/components/resume-form/form";
import { FormInput } from "@/components/resume-form/form/input-group";
import { useResumeStore } from "@/stores/resume-store";
import { formatLocation } from "@/lib/format-location";
import type { ResumeProfile } from "@/types/resume";

export const ProfileForm = () => {
  const profile = useResumeStore((state) => state.resume.profile);
  const changeProfile = useResumeStore((state) => state.changeProfile);
  const { name, email, phone, url, location } = profile;

  const handleProfileChange = (field: keyof ResumeProfile, value: string) => {
    changeProfile(field, value);
  };

  return (
    <BaseForm>
      <div className="grid grid-cols-6 gap-3">
        <FormInput
          label="Name"
          labelClassName="col-span-full"
          name="name"
          placeholder="Sal Khan"
          value={name}
          onChange={handleProfileChange}
        />
        <FormInput
          label="Email"
          labelClassName="col-span-4"
          name="email"
          placeholder="hello@khanacademy.org"
          value={email}
          onChange={handleProfileChange}
        />
        <FormInput
          label="Phone"
          labelClassName="col-span-2"
          name="phone"
          placeholder="(123)456-7890"
          value={phone}
          onChange={handleProfileChange}
        />
        <FormInput
          label="Website"
          labelClassName="col-span-4"
          name="url"
          placeholder="linkedin.com/in/khanacademy"
          value={url}
          onChange={handleProfileChange}
        />
        <label className="col-span-2 text-[11px] text-zinc-500">
          Location
          <input
            type="text"
            name="location"
            value={location ?? ""}
            placeholder="City, State"
            onChange={(e) => handleProfileChange("location", e.target.value)}
            onBlur={(e) => {
              const formatted = formatLocation(e.target.value);
              if (formatted !== e.target.value) {
                handleProfileChange("location", formatted);
              }
            }}
            className="mt-1 px-3 py-2 block w-full rounded-md border-0 bg-white/[0.04] text-[13px] text-white outline-none placeholder:text-zinc-600 focus:bg-white/[0.07] focus:ring-1 focus:ring-zinc-700 transition-colors"
          />
        </label>
      </div>
    </BaseForm>
  );
};
