import { ProfileSkeleton } from "@/components/shared/skeletons";
export default function Loading() {
  return (
    <div className="max-w-lg mx-auto pb-8">
      <ProfileSkeleton />
    </div>
  );
}
