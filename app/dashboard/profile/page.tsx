import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, MapPin, Link as LinkIcon, Calendar } from "lucide-react"

export default function ProfilePage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="relative mb-20">
                <div className="h-48 bg-gradient-to-r from-primary-400 to-red-500 rounded-xl"></div>
                <div className="absolute -bottom-16 left-8 flex items-end">
                    <div className="w-32 h-32 rounded-full border-4 border-background bg-zinc-200 flex items-center justify-center overflow-hidden">
                        <User className="w-16 h-16 text-muted-foreground" />
                    </div>
                    <div className="ml-4 mb-4">
                        <h1 className="text-3xl font-bold text-foreground">Nguyễn Văn A</h1>
                        <p className="text-muted-foreground">Người đam mê văn hóa</p>
                    </div>
                </div>
                <div className="absolute -bottom-12 right-8">
                    <Button className="bg-primary hover:bg-primary/90">Chỉnh sửa hồ sơ</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="font-semibold mb-4">Giới thiệu</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Tôi là một người yêu thích tìm hiểu về các di sản văn hóa phi vật thể của Việt Nam, đặc biệt là tranh dân gian Đông Hồ.
                        </p>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin size={16} />
                                Hà Nội, Việt Nam
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <LinkIcon size={16} />
                                <a href="#" className="hover:text-primary">facebook.com/knds</a>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar size={16} />
                                Tham gia tháng 01/2025
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-span-2 space-y-6">
                    <h3 className="text-xl font-bold">Hoạt động gần đây</h3>
                    <Card className="p-6 text-center text-muted-foreground py-12">
                        Chưa có hoạt động nào được ghi nhận.
                    </Card>
                </div>
            </div>
        </div>
    )
}
