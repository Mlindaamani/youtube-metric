import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore, Channel } from '@/store/useStore';
import { Eye, Users, Video, Pencil, Check, X, Camera } from 'lucide-react';
import { toast } from 'sonner';

interface ChannelCardProps {
  channel: Channel;
}

const StatItem = ({ icon: Icon, value, label }: { icon: React.ElementType; value: number; label: string }) => (
  <div className="flex flex-col items-center p-3 sm:p-4 rounded-xl bg-secondary/50 transition-all duration-200 hover:bg-secondary min-w-0">
    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-brand mb-1 sm:mb-2" />
    <span className="text-lg sm:text-2xl font-bold text-foreground truncate">{value.toLocaleString()}</span>
    <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider text-center">{label}</span>
  </div>
);

export function ChannelCard({ channel }: ChannelCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [customName, setCustomName] = useState(channel.customName || channel.title);
  const [logoUrl, setLogoUrl] = useState(channel.thumbnailUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateCustomName = useStore((state) => state.updateCustomName);

  const handleSave = async () => {
    try {
      await updateCustomName(customName);
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoUrl(result);
        toast.success('Logo updated successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="overflow-hidden animate-slide-up border-brand/20 bg-card/50 backdrop-blur-sm">
      <div className="gradient-hero h-20 sm:h-24" />
      <CardContent className="relative pt-0 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-4 -mt-10 sm:-mt-12">
          <div className="relative group">
            <img
              src={logoUrl}
              alt={channel.title}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-card shadow-elevated object-cover"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <Camera className="h-6 w-6 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
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
          <StatItem icon={Eye} value={channel.stats.totalViews} label="Views" />
          <StatItem icon={Users} value={channel.stats.subscribers} label="Subs" />
          <StatItem icon={Video} value={channel.stats.videoCount} label="Videos" />
        </div>
      </CardContent>
    </Card>
  );
}
