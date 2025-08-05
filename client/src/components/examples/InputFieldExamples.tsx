"use client";

import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { FileText, Mail, Phone, Search, Tag, User } from "lucide-react";

export function InputFieldExamples() {
  const sampleOptions = [
    "Option 1 - Lựa chọn đầu tiên",
    "Option 2 - Lựa chọn thứ hai",
    "Option 3 - Lựa chọn thứ ba",
    "Option 4 - Lựa chọn thứ tư",
    "Option 5 - Lựa chọn thứ năm",
    "Option 6 - Lựa chọn thứ sáu",
    "Option 7 - Lựa chọn thứ bảy",
    "Option 8 - Lựa chọn thứ tám",
  ];

  const customContent = (
    <div className="p-4 space-y-3">
      <div className="text-sm font-medium mb-2">Chọn một tùy chọn:</div>
      {sampleOptions.map((option, index) => (
        <div
          key={index}
          className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer text-sm transition-colors"
          onClick={() => console.log(`Selected: ${option}`)}
        >
          {option}
        </div>
      ))}
    </div>
  );

  const richContent = (
    <div className="p-4 space-y-4">
      <div className="text-sm font-medium">Danh sách người dùng</div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <div className="text-sm">Người dùng A</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            B
          </div>
          <div className="text-sm">Người dùng B</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            C
          </div>
          <div className="text-sm">Người dùng C</div>
        </div>
      </div>
      <div className="pt-2 border-t">
        <Button size="sm" className="w-full">
          Xem tất cả
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          Input bình thường (không có popover)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            placeholder="Input thường với search icon..."
            icon={<Search className="h-4 w-4" />}
          />
          <InputField
            placeholder="Input với user icon..."
            icon={<User className="h-4 w-4" />}
          />
          <InputField
            placeholder="Input với email icon..."
            icon={<Mail className="h-4 w-4" />}
            iconPosition="right"
          />
          <InputField placeholder="Input không có icon..." />
        </div>
        <p className="text-sm text-muted-foreground">
          ↑ Những input này hoạt động như input bình thường vì không có
          popoverContent
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          Input với Popover (có popoverContent)
        </h3>
        <div className="max-w-md">
          <InputField
            placeholder="Tìm kiếm với popover..."
            icon={<Search className="h-4 w-4" />}
            popoverContent={
              <div className="p-4 text-sm text-muted-foreground">
                <p>Đây là nội dung popover cơ bản</p>
              </div>
            }
            popoverHeight="150px"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          Input chọn người dùng với popover
        </h3>
        <div className="max-w-md">
          <InputField
            placeholder="Chọn người dùng..."
            icon={<User className="h-4 w-4" />}
            popoverContent={richContent}
            popoverHeight="300px"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Input chọn options với popover</h3>
        <div className="max-w-md">
          <InputField
            placeholder="Chọn tùy chọn..."
            icon={<Tag className="h-4 w-4" />}
            popoverContent={customContent}
            popoverHeight="250px"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          So sánh Input với và không có popover
        </h3>
        <div className="space-y-3">
          <div className="max-w-md">
            <label className="text-sm font-medium">Input bình thường:</label>
            <InputField
              placeholder="Nhập text bình thường..."
              icon={<FileText className="h-4 w-4" />}
              className="mt-1"
            />
          </div>
          <div className="max-w-md">
            <label className="text-sm font-medium">Input có popover:</label>
            <InputField
              placeholder="Click để mở popover..."
              icon={<FileText className="h-4 w-4" />}
              className="mt-1"
              popoverContent={
                <div className="p-4">
                  <p className="text-sm">
                    Popover xuất hiện khi click hoặc focus
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Tùy chọn:
                    </div>
                    <div className="text-sm p-1 hover:bg-accent rounded cursor-pointer">
                      Tùy chọn 1
                    </div>
                    <div className="text-sm p-1 hover:bg-accent rounded cursor-pointer">
                      Tùy chọn 2
                    </div>
                  </div>
                </div>
              }
              popoverHeight="150px"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Input form thông thường</h3>
        <div className="max-w-md space-y-3">
          <InputField
            placeholder="Tên của bạn..."
            icon={<User className="h-4 w-4" />}
          />
          <InputField
            placeholder="Email của bạn..."
            icon={<Mail className="h-4 w-4" />}
            type="email"
          />
          <InputField
            placeholder="Số điện thoại..."
            icon={<Phone className="h-4 w-4" />}
            type="tel"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          ↑ Form bình thường với các input có icon nhưng không có popover
        </p>
      </div>
    </div>
  );
}
