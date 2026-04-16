"use client";

import { ExpanderWithHeightTransition } from "@/components/resume-form/expander-with-height-transition";
import {
  DeleteIconButton,
  MoveIconButton,
  ShowIconButton,
} from "@/components/resume-form/form/icon-button";
import { useSettingsStore } from "@/stores/settings-store";
import { useResumeStore } from "@/stores/resume-store";
import type { ShowForm } from "@/types/settings";
import { PlusSmallIcon } from "@heroicons/react/24/outline";

export const BaseForm = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={`flex flex-col gap-3 transition-opacity duration-200 ${className}`}
  >
    {children}
  </section>
);

export const Form = ({
  form,
  addButtonText,
  children,
}: {
  form: ShowForm;
  addButtonText?: string;
  children: React.ReactNode;
}) => {
  const showForm = useSettingsStore(
    (state) => state.settings.formToShow[form]
  );
  const heading = useSettingsStore(
    (state) => state.settings.formToHeading[form]
  );
  const formsOrder = useSettingsStore((state) => state.settings.formsOrder);
  const changeShowForm = useSettingsStore((state) => state.changeShowForm);
  const changeFormHeading = useSettingsStore(
    (state) => state.changeFormHeading
  );
  const changeFormOrder = useSettingsStore((state) => state.changeFormOrder);
  const addSection = useResumeStore((state) => state.addSection);

  const isFirstForm = formsOrder[0] === form;
  const isLastForm = formsOrder[formsOrder.length - 1] === form;

  const setShowForm = (value: boolean) => {
    changeShowForm(form, value);
  };

  const setHeading = (value: string) => {
    changeFormHeading(form, value);
  };

  const handleMoveClick = (type: "up" | "down") => {
    changeFormOrder(form, type);
  };

  return (
    <BaseForm
      className={`group/section transition-opacity duration-200 ${
        showForm ? "" : "opacity-40"
      }`}
    >
      {/* Section header */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          className="flex-1 bg-transparent text-[11px] font-semibold uppercase tracking-widest text-zinc-400 outline-none placeholder:text-zinc-600 focus:text-white"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
        />
        <div className="flex items-center gap-0.5">
          {!isFirstForm && (
            <MoveIconButton type="up" onClick={handleMoveClick} />
          )}
          {!isLastForm && (
            <MoveIconButton type="down" onClick={handleMoveClick} />
          )}
          <ShowIconButton show={showForm} setShow={setShowForm} />
        </div>
      </div>

      <ExpanderWithHeightTransition expanded={showForm}>
        {children}
      </ExpanderWithHeightTransition>

      {showForm && addButtonText && (
        <button
          type="button"
          onClick={() => addSection(form)}
          className="mt-1 flex items-center self-start rounded px-2 py-1 text-[11px] text-zinc-600 transition-colors hover:text-zinc-300"
        >
          <PlusSmallIcon className="mr-0.5 h-3.5 w-3.5" aria-hidden="true" />
          {addButtonText}
        </button>
      )}
    </BaseForm>
  );
};

export const FormSection = ({
  form,
  idx,
  showMoveUp,
  showMoveDown,
  showDelete,
  children,
}: {
  form: ShowForm;
  idx: number;
  showMoveUp: boolean;
  showMoveDown: boolean;
  showDelete: boolean;
  children: React.ReactNode;
}) => {
  const moveSection = useResumeStore((state) => state.moveSection);
  const deleteSection = useResumeStore((state) => state.deleteSection);

  const handleDeleteClick = () => {
    deleteSection(form, idx);
  };

  const handleMoveClick = (direction: "up" | "down") => {
    moveSection(form, idx, direction);
  };

  return (
    <>
      {idx !== 0 && (
        <div className="my-3 border-t border-zinc-800/40" />
      )}
      <div className="group/item relative grid grid-cols-6 gap-3">
        {children}
        <div className="absolute -right-1 -top-1 flex gap-0.5">
          {showMoveUp && (
            <MoveIconButton
              type="up"
              size="small"
              onClick={() => handleMoveClick("up")}
            />
          )}
          {showMoveDown && (
            <MoveIconButton
              type="down"
              size="small"
              onClick={() => handleMoveClick("down")}
            />
          )}
          {showDelete && (
            <DeleteIconButton
              onClick={handleDeleteClick}
            />
          )}
        </div>
      </div>
    </>
  );
};
