"use client";

import { Form, FormSection } from "@/components/resume-form/form";
import {
  FormInput,
  BulletListTextarea,
} from "@/components/resume-form/form/input-group";
import type { CreateHandleChangeArgsWithDescriptions } from "@/components/resume-form/types";
import { useResumeStore } from "@/stores/resume-store";
import type { ResumePublication } from "@/types/resume";

export const PublicationsForm = () => {
  const publications = useResumeStore((state) => state.resume.publications);
  const changePublications = useResumeStore((state) => state.changePublications);

  const showDelete = publications.length > 1;

  return (
    <Form form="publications" addButtonText="Add Publication">
      {publications.map(({ title, authors, venue, date, url, descriptions }, idx) => {
        const handlePublicationChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumePublication>
        ) => {
          changePublications({ idx, field, value } as Parameters<typeof changePublications>[0]);
        };

        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== publications.length - 1;

        return (
          <FormSection
            key={idx}
            form="publications"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
          >
            <FormInput
              name="title"
              label="Title"
              placeholder="A Novel Approach to..."
              value={title}
              onChange={handlePublicationChange}
              labelClassName="col-span-full"
            />
            <FormInput
              name="authors"
              label="Authors"
              placeholder="J. Smith, A. Doe, et al."
              value={authors}
              onChange={handlePublicationChange}
              labelClassName="col-span-full"
            />
            <FormInput
              name="venue"
              label="Venue"
              placeholder="Nature, NeurIPS, arXiv"
              value={venue}
              onChange={handlePublicationChange}
              labelClassName="col-span-4"
            />
            <FormInput
              name="date"
              label="Date"
              placeholder="2024"
              value={date}
              onChange={handlePublicationChange}
              labelClassName="col-span-2"
            />
            <FormInput
              name="url"
              label="URL / DOI (optional)"
              placeholder="https://doi.org/..."
              value={url}
              onChange={handlePublicationChange}
              labelClassName="col-span-full"
            />
            <div className="col-span-full">
              <span className="text-sm font-medium text-zinc-400">Notes (optional)</span>
              <BulletListTextarea
                label=""
                labelClassName="col-span-full"
                name="descriptions"
                placeholder="Bullet points"
                value={descriptions}
                onChange={handlePublicationChange}
              />
            </div>
          </FormSection>
        );
      })}
    </Form>
  );
};
