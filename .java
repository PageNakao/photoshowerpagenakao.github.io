import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

@WebServlet("/upload")
@MultipartConfig
public class PhotoUploadServlet extends HttpServlet {
    private static final String UPLOAD_DIR = "/path/to/upload/directory";

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // アップロードされたファイルを保存するディレクトリを作成
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdir();
        }

        // アップロードされたファイルを処理
        for (Part part : request.getParts()) {
            // ランダムなファイル名を生成
            String fileName = UUID.randomUUID().toString() + getExtension(part.getSubmittedFileName());
            String filePath = UPLOAD_DIR + File.separator + fileName;

            // ファイルを保存
            try (InputStream inputStream = part.getInputStream();
                    FileOutputStream outputStream = new FileOutputStream(filePath)) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
            }

            // ここで保存されたファイルの情報をどこかに保存するなど、必要な処理を行うことができます
            // 例えば、データベースにファイルのパスや他のメタデータを保存するなど
        }

        // アップロードが完了したら、任意のページにリダイレクトするなどの処理を行うことができます
        response.sendRedirect("upload-success.html");
    }

    private String getExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex >= 0) {
            return fileName.substring(dotIndex);
        }
        return "";
    }
}
