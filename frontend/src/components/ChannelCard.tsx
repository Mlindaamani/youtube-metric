import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChannelStore } from '@/store/channelStore';
import { ChannelInfo } from '@/types';
import { Eye, Users, Video, Pencil, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ChannelCardProps {
  channel: ChannelInfo;
}

const StatItem = ({ icon: Icon, value, label }: { icon: React.ElementType; value: string | number; label: string }) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) || 0 : value;
  return (
    <div className="flex flex-col items-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-lg min-w-0 border border-slate-200 dark:border-slate-700">
      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-brand mb-1 sm:mb-2" />
      <span className="text-lg sm:text-2xl font-bold text-foreground truncate">{numValue.toLocaleString()}</span>
      <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider text-center">{label}</span>
    </div>
  );
};

export function ChannelCard({ channel }: ChannelCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [customName, setCustomName] = useState(channel.customName || channel.title);
  const { updateChannel } = useChannelStore();
  const { loading } = useChannelStore();

  // Show skeleton loader while loading
  if (loading) {
    return (
      <Card className="overflow-hidden animate-slide-up border-brand/20 bg-gradient-to-br from-card to-card/80 dark:from-slate-950 dark:to-slate-900/80 backdrop-blur-sm shadow-lg">
        <div className="gradient-hero h-20 sm:h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-brand" />
        <CardContent className="relative pt-0 px-4 sm:px-6">
          {/* Logo skeleton */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-card -mt-10 sm:-mt-12 bg-slate-200 dark:bg-slate-700 animate-pulse" />

          {/* Title skeleton */}
          <div className="mt-4 space-y-2">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 sm:p-4 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse min-h-20" />
            ))}
          </div>

          {/* Loading indicator */}
          <div className="flex items-center justify-center mt-6 gap-2 py-4">
            <Loader2 className="h-5 w-5 text-brand animate-spin" />
            <span className="text-sm text-muted-foreground">Loading channel data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleSave = async () => {
    try {
      await updateChannel(channel.channelId, { customName });
      setIsEditing(false);
      toast.success('Channel name updated successfully');
    } catch {
      toast.error('Failed to update channel name');
    }
  };

  const handleCancel = () => {
    setCustomName(channel.customName || channel.title);
    setIsEditing(false);
  };

  return (
    <Card className="overflow-hidden animate-slide-up border-brand/20 bg-gradient-to-br from-card to-card/80 dark:from-slate-950 dark:to-slate-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
      <div className="gradient-hero h-20 sm:h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-brand" />
      <CardContent className="relative pt-0 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-4 -mt-10 sm:-mt-12">
          <div className="relative">
            <img
              src={channel.thumbnailUrl || channel.liveStats?.thumbnailUrl || ''}
              alt={channel.title}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-card shadow-elevated object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-brand flex items-center justify-center">
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-foreground" />
            </div>
          </div>
          
          <div className="flex-1 text-center sm:text-left pb-2 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Input
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="max-w-[200px] sm:max-w-xs"
                  autoFocus
                />
                <Button size="icon" variant="ghost" onClick={handleSave}>
                  <Check className="h-4 w-4 text-brand" />
                </Button>
                <Button size="icon" variant="ghost" onClick={handleCancel}>
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                  {channel.customName || channel.title}
                </h2>
                <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)} className="shrink-0">
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            )}
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">@{channel.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6">
          <StatItem icon={Eye} value={channel.liveStats?.viewCount || '0'} label="Views" />
          <StatItem icon={Users} value={channel.liveStats?.subscriberCount || '0'} label="Subs" />
          <StatItem icon={Video} value={channel.liveStats?.videoCount || '0'} label="Videos" />
        </div>
      </CardContent>
    </Card>
  );
}
