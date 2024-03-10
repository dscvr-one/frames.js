"use client";

import { DscvrIdentity } from "../hooks/use-dscvr-identity";

const sampleUser: DscvrIdentity = {
  dscvrId: "slrjv-o4wlb-7mjt3-rjegb-psx7i-5ndvk-qkesi-ks3c3-mplfb-ort5m-bqe",
  contentId: BigInt("1200897534843682816"),
};

const LoginWindow = ({
  dscvrIdentity,
  impersonateUser,
  logout,
}: {
  dscvrIdentity: DscvrIdentity | null | undefined;
  impersonateUser: (opts: DscvrIdentity) => void;
  logout?: () => void;
}) => {
  return (
    <div style={{ minWidth: "150px" }} className="mt-4">
      <form
        action=""
        className="flex flex-col items-start gap-1"
        onSubmit={async (e: any) => {
          e.preventDefault();
          const { value: formDscvrId } = e.target[0] as HTMLInputElement;
          if (!formDscvrId) return;
          let { value: formContentId } = e.target[1] as HTMLInputElement;
          const user: DscvrIdentity = {
            dscvrId: formDscvrId,
          };
          try {
            user.contentId = BigInt(formContentId);
          } catch (e) {
            user.contentId = undefined;
            console.error("Failed to parse contentId", e);
          }
          impersonateUser(user);
        }}
      >
        {dscvrIdentity?.dscvrId ? (
          <>
            <div>Impersonating dscvrId as {dscvrIdentity.dscvrId}</div>
            {dscvrIdentity.contentId ? (
              <div>
                Impersonating contentId as {dscvrIdentity.contentId.toString()}
              </div>
            ) : (
              <div>No content</div>
            )}
            <button type="button" className="underline" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              name="formDscvrId"
              placeholder="DscvrId to impersonate"
              className="w-60"
            />
            <input
              type="text"
              name="formContentId"
              placeholder="ContentId to impersonate"
              className="w-60"
            />
            <button className="underline" type="submit">
              Impersonate
            </button>
          </>
        )}
        <button
          type="button"
          className="underline"
          onClick={(_) => impersonateUser(sampleUser)}
        >
          Use Rckprtr
        </button>
      </form>
    </div>
  );
};

export default LoginWindow;
