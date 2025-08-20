"use client";

import type { Post } from "@cartel-sh/ui";
import { useEffect, useState } from "react";
import Link from "../Link";
import { Card } from "../ui/card";

const generateVideoThumbnail = (videoUrl: string): Promise<{ thumbnail: string; aspectRatio: number }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    video.crossOrigin = "anonymous";
    video.muted = true;

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.currentTime = 0;
    };

    video.onseeked = () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const thumbnail = canvas.toDataURL("image/jpeg", 0.8);
        const aspectRatio = video.videoHeight / video.videoWidth;
        resolve({ thumbnail, aspectRatio });
      } else {
        reject(new Error("Canvas context not available"));
      }
    };

    video.onerror = (error) => {
      reject(new Error(`Video loading failed: ${error}`));
    };

    video.src = videoUrl;
  });
};

export const PostGallery = ({ post }: { post: Post }) => {
  const metadata = post.metadata;
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);

  let src: string | undefined;
  let isVideo = false;

  const attachments = (metadata as any)?.attachments || [];
  const firstAttachment = attachments[0];
  
  if (firstAttachment) {
    isVideo = firstAttachment.type?.startsWith('video/') || false;
    src = isVideo ? (firstAttachment.cover || generatedThumbnail || firstAttachment.item) : firstAttachment.item;
  }

  useEffect(() => {
    if (isVideo && src && !generatedThumbnail && !firstAttachment?.cover) {
      generateVideoThumbnail(src)
        .then(({ thumbnail }) => {
          setGeneratedThumbnail(thumbnail);
        })
        .catch((error) => {
          console.error("Failed to generate video thumbnail:", error);
        });
    }
  }, [isVideo, src, generatedThumbnail, firstAttachment?.cover]);

  if (!src && !isVideo) return null;

  return (
    <Link
      href={`/p/${post.id}`}
      className="hover:scale-[102%] active:scale-[100%] active:opacity-60 transition-all duration-100"
    >
      <Card className="overflow-hidden p-0">
        {isVideo && !firstAttachment?.cover && !generatedThumbnail ? (
          <div className="relative w-full aspect-square bg-muted flex items-center justify-center">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        ) : (
          <div className="relative w-full aspect-square">
            <img src={src} alt="" className="object-cover w-full h-full" />
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            )}
          </div>
        )}
      </Card>
    </Link>
  );
};
